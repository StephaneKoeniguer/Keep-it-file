<?php

namespace App\Controller;

use App\Entity\Documents;
use App\Entity\User;
use App\Repository\DocumentsRepository;
use App\Repository\SharedResourceRepository;
use App\Repository\UserRepository;
use App\Services\FileEncryptionService;
use App\Services\FileService;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class DocumentsController extends AbstractController
{
    /**
     * Get all documents
     * @param DocumentsRepository $documentsRepository
     * @param UserRepository $userRepository
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    #[Route('/api/documents', name: 'app_documents', methods: ['GET'])]
    #[isGranted('ROLE_USER')]
    public function getDocuments(DocumentsRepository $documentsRepository,
                                 UserRepository $userRepository,
                                 SerializerInterface $serializer,
                                 FileEncryptionService $encryptionService ): JsonResponse
    {

        $user = $this->getUser();
        $userDataBase = $userRepository->findOneBy(['email' => $user->getEmail()]);

        if (in_array('ROLE_ADMIN', $userDataBase->getRoles())) {
            $fileList = $documentsRepository->findAllDocuments();
        } else {
            $fileList = $documentsRepository->findByUserAndSort($userDataBase, 'ASC');
        }

        // No documents
        if (empty($fileList['files'])) {
            $response = ['files' => $fileList];
        } else {

            foreach ($fileList['files'] as $document) {

                $decryptedFilePath = $encryptionService->decryptToTemporaryFile($document->getPath());
                // Mettre à jour le chemin du fichier pour qu'il pointe vers le fichier décrypté
                $document->setPath($decryptedFilePath);
                // Normaliser le fichier pour la réponse
                $filesResponse[] = $serializer->normalize($document, null, ['groups' => 'getFiles']);

                // Supprimer le fichier temporaire après normalisation
                if (isset($decryptedFilePath) && file_exists($decryptedFilePath)) {
                    unlink($decryptedFilePath);
                }
            }
            $response = ['files' => $filesResponse];
        }

        return new JsonResponse($response, Response::HTTP_OK);
    }

    /**
     * Save a new document in database and server
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param UserRepository $userRepository
     * @param EntityManagerInterface $em
     * @param FileService $fileService
     * @param FileEncryptionService $encryptionService
     * @return JsonResponse
     * @throws RandomException
     */
    #[Route('/api/documents', name: 'app_documents_save', methods: ['POST'])]
    #[isGranted('ROLE_USER')]
    public function saveDocuments(Request $request,
                                  ValidatorInterface $validator,
                                  UserRepository $userRepository,
                                  EntityManagerInterface $em,
                                  FileService $fileService,
                                  FileEncryptionService $encryptionService ): JsonResponse
    {
        $uploadedFile = $request->files->get('file');
        $fileName = trim($request->get('fileName') ?? '');
        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'No file'], Response::HTTP_BAD_REQUEST);
        }
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not connect'], Response::HTTP_UNAUTHORIZED);
        }

        $document = new Documents();
        $document->setFile($uploadedFile);
        $document->setName($fileName);
        $document->setType($uploadedFile->getMimeType());
        $document->setSize($uploadedFile->getSize() / 1024 / 1024);
        $document->setCreatedAt(new \DateTimeImmutable());
        $document->setUpdatedAt(new \DateTimeImmutable());
        /** @var User $user */
        $document->setUser($user);

        $errors = $validator->validate($document);
        if (count($errors) > 0) {
            return new JsonResponse(['error' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Call service FileService.php
            $databaseUser = $userRepository->findOneBy(['email' => $user->getEmail()]);
            // Encrypting file
            $encryptedFile = $encryptionService->encryptFile($uploadedFile);
            $filePath = $fileService->uploadFile($encryptedFile, $databaseUser->getId(), $document);
            $document->setPath($filePath);
            $em->persist($document);
            $em->flush();

            return new JsonResponse([
                'message' => 'File uploaded successfully',
                'file' => [
                    'id'        =>  $document->getId(),
                    'filename'  =>  $document->getname(),
                    'path'      =>  $document->getPath(),
                    'size'      =>  $document->getSize(),
                    'mimeType'  =>  $document->getType(),
                    'createdAt' =>  $document->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user'      =>  $user->getUsername(),
                ],
            ], Response::HTTP_CREATED);

        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a document
     * @param int $id
     * @param DocumentsRepository $documentsRepository
     * @param EntityManagerInterface $em
     * @param FileService $fileService
     * @return JsonResponse
     */
    #[Route('/api/documents/{id}', name: 'app_documents_delete', methods: ['DELETE'])]
    #[isGranted('ROLE_USER')]
    public function deleteDocuments(int $id, DocumentsRepository $documentsRepository, EntityManagerInterface $em, FileService $fileService): JsonResponse
    {
        $file = $documentsRepository->find($id);
        // Check if file exist
        if (!$file) {
            return new JsonResponse(['error' => 'Document not found'], Response::HTTP_NOT_FOUND);
        }
        // Check that the connected user is the owner of the document
        if ($file->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'You do not have permission to delete this document'], Response::HTTP_FORBIDDEN);
        }

        try {
            // Call service FileService.php
            $fileService->deleteFile($file);
            // Check if directory is empty
            $directoryPath = dirname($file->getPath());
            if ($fileService->isDirectoryEmpty($directoryPath)) {
                $fileService->deleteEmptyDirectory($directoryPath);
            }
            $em->remove($file);
            $em->flush();

            return new JsonResponse(['message' => 'Document deleted successfully'], Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred while deleting the document'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Download a document
     * @param int $id
     * @param DocumentsRepository $documentsRepository
     * @param UserRepository $userRepository
     * @param FileService $fileService
     * @return Response
     */
    #[Route('/api/documents/download/{id}', name: 'app_documents_download', methods: ['GET'])]
    #[isGranted('ROLE_USER')]
    public function download(int $id, DocumentsRepository $documentsRepository, UserRepository $userRepository,FileEncryptionService $encryptionService, FileService $fileService): Response
    {
        $file = $documentsRepository->find($id);
        $user = $this->getUser();
        $userDataBase = $userRepository->findOneBy(['email' => $user->getEmail()]);
        // Check if file exist
        if (!$file) {
            return new JsonResponse(['error' => 'Document not found'], Response::HTTP_NOT_FOUND);
        }
        // Check that the connected user is the owner of the document
        if ($file->getUser() !== $userDataBase) {
            return new JsonResponse(['error' => 'You do not have permission to download this document'], Response::HTTP_FORBIDDEN);
        }

        try {
            $filePath = $encryptionService->decryptToTemporaryFile($file->getPath());
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error decrypting file: '], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        // Retourner le fichier décrypté
        return $fileService->downloadFile($filePath);
    }

    /**
     * Create a link to share document
     * @param int $id
     * @param DocumentsRepository $documentsRepository
     * @param FileService $fileService
     * @return JsonResponse
     */
    #[Route('/api/documents/share/{id}', name: 'app_documents_share', methods: ['GET'])]
    public function share(int $id, DocumentsRepository $documentsRepository, FileService $fileService): JsonResponse
    {
        $document = $documentsRepository->find($id);
        if (!$document) {
            return new JsonResponse(['error' => 'Document not found'], Response::HTTP_NOT_FOUND);
        }
        // Générez un lien sécurisé ou un token pour ce document
        $shareLink = $fileService->generateShareLink($document->getId());

        return new JsonResponse(['link' => $shareLink]);
    }


    /**
     * Public route to download file
     * @param string $token
     * @param SharedResourceRepository $sharedDocumentRepository
     * @param DocumentsRepository $documentsRepository
     * @param FileService $fileService
     * @return Response
     */
    #[Route('/api/documents/download/share/{token}', name: 'app_documents_download_share', methods: ['GET'])]
    public function downloadWithToken(string $token,
                                      SharedResourceRepository $sharedDocumentRepository,
                                      DocumentsRepository $documentsRepository,
                                      FileEncryptionService $encryptionService,
                                      FileService $fileService ): Response
    {
        $sharedDocument = $sharedDocumentRepository->findOneBy(['token' => $token]);

        if (!$sharedDocument) {
            return new JsonResponse(['error' => 'Invalid or expired token'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si le lien a expiré
        if ($sharedDocument->getExpirationDate() && $sharedDocument->getExpirationDate() < new \DateTimeImmutable()) {
            return new JsonResponse(['error' => 'Link has expired'], Response::HTTP_FORBIDDEN);
        }

        // TODO : le lien ne fonctionne pas le type Mime n'est pas trouvé
        // Récupérer le chemin du fichier
        $document = $documentsRepository->find($sharedDocument->getResourceId());
        try {
            $filePath = $encryptionService->decryptToTemporaryFile($document->getPath());
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error decrypting file: '], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Utiliser le service pour renvoyer le fichier
        return $fileService->downloadFile($filePath);
    }

}
