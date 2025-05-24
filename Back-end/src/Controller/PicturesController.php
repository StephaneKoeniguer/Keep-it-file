<?php

namespace App\Controller;

use App\Entity\Pictures;
use App\Entity\User;
use App\Repository\PicturesRepository;
use App\Repository\UserRepository;
use App\Services\FileEncryptionService;
use App\Services\FileService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Random\RandomException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class PicturesController extends AbstractController
{
    /**
     * Get all pictures
     * @param PicturesRepository $picturesRepository
     * @param UserRepository $userRepository
     * @param SerializerInterface $serializer
     * @return JsonResponse
     * @throws Exception
     */
    #[Route('/api/pictures', name: 'app_pictures', methods: ['GET'])]
    #[isGranted('ROLE_USER')]
    public function getPictures(PicturesRepository $picturesRepository,
                                UserRepository $userRepository,
                                SerializerInterface $serializer,
                                FileEncryptionService $encryptionService ): JsonResponse
    {

        $user = $this->getUser();
        $userDataBase = $userRepository->findOneBy(['email' => $user->getEmail()]);

        if (in_array('ROLE_ADMIN', $userDataBase->getRoles())) {
            $pictureList = $picturesRepository->findAllPictures();
        } else {
            $pictureList = $picturesRepository->findByUserAndSort($userDataBase, 'ASC');
        }

        // No pictures
        if (empty($pictureList['pictures'])) {
            $response = ['pictures' => $pictureList];
        } else {

            foreach ($pictureList['pictures'] as $picture) {

                $decryptedFilePath = $encryptionService->decryptToTemporaryFile($picture->getPath());

                $mimeType = mime_content_type($decryptedFilePath);

                switch ($mimeType) {
                    case 'image/jpeg':
                        $extension = '.jpeg';
                        break;
                    case 'image/png':
                        $extension = '.png';
                        break;
                    case 'image/gif':
                        $extension = '.gif';
                        break;
                    default:
                        throw new Exception("Type de fichier non supporté : $mimeType");
                }

                $newFilePath = $decryptedFilePath . $extension;
                rename($decryptedFilePath, $newFilePath);


                $publicPath = '/uploads/test/' . basename($newFilePath);
                $destinationPath = $_SERVER['DOCUMENT_ROOT'] . $publicPath; // Chemin absolu vers le dossier public

                // Copier le fichier décrypté vers ce répertoire
                copy($newFilePath, $destinationPath);



                // Mettre à jour le chemin du fichier pour qu'il pointe vers le fichier décrypté
                $picture->setPath($publicPath);
                // Normaliser le fichier pour la réponse
                $picturesResponse[] = $serializer->normalize($picture, null, ['groups' => 'getPictures']);

                // Supprimer le fichier temporaire après normalisation
                if (isset($decryptedFilePath) && file_exists($decryptedFilePath)) {
                    unlink($decryptedFilePath);
                }
            }

            $response = ['pictures' => $picturesResponse];

        }
        return new JsonResponse($response, Response::HTTP_OK);

    }

    /**
     * Save a new picture in database and server
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param UserRepository $userRepository
     * @param EntityManagerInterface $em
     * @param FileService $fileUploadService
     * @return JsonResponse
     * @throws RandomException
     */
    #[Route('/api/pictures', name: 'app_pictures_save', methods: ['POST'])]
    #[isGranted('ROLE_USER')]
    public function savePictures(Request $request,
                                 ValidatorInterface $validator,
                                 UserRepository $userRepository,
                                 EntityManagerInterface $em,
                                 FileService $fileUploadService,
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

        $picture = new Pictures();
        $picture->setFile($uploadedFile);
        $picture->setName($fileName);
        $picture->setSize($uploadedFile->getSize() / 1024 / 1024);
        $picture->setCreatedAt(new \DateTimeImmutable());
        $picture->setUpdatedAt(new \DateTimeImmutable());
        /** @var User $user */
        $picture->setUser($user);

        $errors = $validator->validate($picture);
        if (count($errors) > 0) {
            return new JsonResponse(['error' => (string) $errors], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Call service FileService.php
            $databaseUser = $userRepository->findOneBy(['email' => $user->getEmail()]);
            // Encrypting file
            $encryptedFile = $encryptionService->encryptFile($uploadedFile);
            $filePath = $fileUploadService->uploadFile($encryptedFile, $databaseUser->getId(), $picture);
            $picture->setPath($filePath);
            $em->persist($picture);
            $em->flush();

            return new JsonResponse([
                'message' => 'Picture uploaded successfully',
                'file' => [
                    'id'        =>  $picture->getId(),
                    'filename'  =>  $picture->getname(),
                    'path'      =>  $picture->getPath(),
                    'size'      =>  $picture->getSize(),
                    'createdAt' =>  $picture->getCreatedAt()->format('Y-m-d H:i:s'),
                    'user'      =>  $user->getUsername(),
                ],
            ], Response::HTTP_CREATED);

        } catch (\RuntimeException $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Delete a picture
     * @param int $id
     * @param PicturesRepository $picturesRepository
     * @param EntityManagerInterface $em
     * @param FileService $fileUploadService
     * @return JsonResponse
     */
    #[Route('/api/pictures/{id}', name: 'app_pictures_delete', methods: ['DELETE'])]
    #[isGranted('ROLE_USER')]
    public function deletePictures(int $id, PicturesRepository $picturesRepository, EntityManagerInterface $em, FileService $fileUploadService): JsonResponse
    {
        $picture = $picturesRepository->find($id);
        // Check if picture exist
        if (!$picture) {
            return new JsonResponse(['error' => 'Picture not found'], Response::HTTP_NOT_FOUND);
        }

        // Check that the connected user is the owner of the picture
        if ($picture->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'You do not have permission to delete this picture'], Response::HTTP_FORBIDDEN);
        }

        try {
            // Call service FileService.php
            $fileUploadService->deleteFile($picture);
            // Check if directory is empty
            $directoryPath = dirname($picture->getPath());
            if ($fileUploadService->isDirectoryEmpty($directoryPath)) {
                $fileUploadService->deleteEmptyDirectory($directoryPath);
            }
            $em->remove($picture);
            $em->flush();

            return new JsonResponse(['message' => 'Picture deleted successfully'], Response::HTTP_NO_CONTENT);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred while deleting the picture'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
