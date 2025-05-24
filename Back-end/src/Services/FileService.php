<?php

namespace App\Services;

use App\Entity\Documents;
use App\Entity\SharedResource;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use InvalidArgumentException;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class FileService
{

    private readonly string $uploadDirectoryDocument;
    private readonly string $uploadDirectoryPicture;
    private Filesystem $fileSystem;
    private readonly RouterInterface $router;
    private readonly EntityManagerInterface $em;

    public function __construct(ParameterBagInterface $parameterBag, RouterInterface $router, EntityManagerInterface $em)
    {
        // Retrieve the upload directory from the parameters
        $this->uploadDirectoryDocument = $parameterBag->get('upload_directory_document');
        $this->uploadDirectoryPicture = $parameterBag->get('upload_directory_picture');
        $this->fileSystem = new Filesystem();
        $this->router = $router;
        $this->em = $em;
    }

    /**
     * Create a directory if not exist and upload the file
     * @param UploadedFile $uploadedFile
     * @param int $userId
     * @param $entity
     * @return string
     */
    public final function uploadFile($fileResource, int $userId, $entity): string
    {
        // Create a secure file name
        $newFilename = uniqid() . '.enc'; // .enc pour indiquer que le fichier est crypté

        if ($entity instanceof Documents) {
            $userDirectory = $this->uploadDirectoryDocument . '/' . $userId;
        } else {
            $userDirectory = $this->uploadDirectoryPicture . '/' . $userId;
        }

        // Create the user's directory if it doesn't exist
        if (!$this->fileSystem->exists($userDirectory)) {
            $this->fileSystem->mkdir($userDirectory, 0777);
        }
        $filePath = $userDirectory . '/' . $newFilename;

        // Ouvre le fichier de destination en écriture
        $file = fopen($filePath, 'wb');
        if (!$file) {
            throw new \RuntimeException('Error opening file for writing');
        }
        // Copie le contenu du fichier temporaire (crypté) vers le fichier final
        stream_copy_to_stream($fileResource, $file);

        // Ferme le fichier une fois l'écriture terminée
        fclose($file);

        return $filePath;

    }

    /**
     * Download
     * @param string $filePath
     * @return Response
     */
    public final function downloadFile(string $filePath): Response
    {
        if (!file_exists($filePath)) {
            throw new FileNotFoundException("File not found");
        }
        // Déterminer le type MIME du fichier
        $mimeType = mime_content_type($filePath);
        // Type MIME par défaut
        if (!$mimeType) {
            $mimeType = 'application/octet-stream';
        }
        // Créer une réponse pour télécharger le fichier
        return new Response(
            file_get_contents($filePath),
            200,
            [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'attachment; filename="' . basename($filePath) . '"',
            ]
        );
    }

    /**
     * Generate a link with expiration date and save in database
     * @param int $id
     * @return string
     * @throws \DateMalformedStringException
     * @throws \Random\RandomException
     */
    public final function generateShareLink(int $id): string
    {
        // Utiliser un token pour créer un lien sécurisé
        $token = bin2hex(random_bytes(16));
        $expirationDate = (new \DateTimeImmutable())->modify('+1 days');

        // Sauvegarde database
        $sharedDocument = new SharedResource();
        $sharedDocument->setResourceId($id);
        $sharedDocument->setToken($token);
        $sharedDocument->setExpirationDate($expirationDate);
        $sharedDocument->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($sharedDocument);
        $this->em->flush();

        // Lien de partage
        return $this->router->generate('app_documents_download_share', ['token' => $token], UrlGeneratorInterface::ABSOLUTE_URL);
    }

    /**
     * Delete the file
     * @param $entity
     * @return void
     */
    public final function deleteFile($entity): void
    {
        $filePath = $entity->getPath();
        if ($this->fileSystem->exists($filePath)) {
            $this->fileSystem->remove($filePath);
        }
    }

    /**
     * Check if directory is empty
     * @param string $directoryPath
     * @return bool
     */
    public final function isDirectoryEmpty(string $directoryPath): bool
    {
        // Check if path is a valid directory
        if (!is_dir($directoryPath)) {
            throw new InvalidArgumentException("The provided path is not a valid directory: $directoryPath");
        }
        // Open directory
        $files = scandir($directoryPath);
        // Filter standard entry ('.' and '..')
        $filteredFiles = array_diff($files, ['.', '..']);
        return empty($filteredFiles);
    }

    /**
     * Delete an empty directory
     * @param string $directoryPath
     * @return void
     */
    public final function deleteEmptyDirectory(string $directoryPath): void
    {
        if (!is_dir($directoryPath)) {
            throw new \InvalidArgumentException("The provided path is not a valid directory: $directoryPath");
        }

        if (!rmdir($directoryPath)) {
            throw new \RuntimeException("Failed to delete the directory: $directoryPath");
        }
    }

}