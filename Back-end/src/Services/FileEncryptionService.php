<?php

namespace App\Services;

use Random\RandomException;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class FileEncryptionService {
    private string $key;

    public function __construct(ParameterBagInterface $parameterBag) {
        $this->key = $parameterBag->get('encryption_key');
    }

    /**
     * @throws RandomException
     */
    public final function encryptFile(string $filePath)
    {
        $iv = random_bytes(openssl_cipher_iv_length('aes-256-cbc'));
        $data = file_get_contents($filePath);
        $encryptedData = openssl_encrypt($data, 'aes-256-cbc', $this->key, 0, $iv);

        // Créer un fichier temporaire pour y mettre le contenu crypté
        $tempFile = tmpfile();
        fwrite($tempFile, $iv . $encryptedData);
        fseek($tempFile, 0);

        return $tempFile;
    }

    public final function decryptToTemporaryFile(string $encryptedFilePath)
    {
        $data = file_get_contents($encryptedFilePath);
        $ivLength = openssl_cipher_iv_length('aes-256-cbc');
        $iv = substr($data, 0, $ivLength);
        $encryptedData = substr($data, $ivLength);

        $decryptedData = openssl_decrypt($encryptedData, 'aes-256-cbc', $this->key, 0, $iv);

        if ($decryptedData === false) {
            throw new \RuntimeException('Decryption failed for the file: ' . $encryptedFilePath);
        }

        // Créer un fichier temporaire pour y mettre le contenu décrypté
        $tempFile = tempnam(sys_get_temp_dir(), 'decrypted_');
        file_put_contents($tempFile, $decryptedData);

        return $tempFile;
    }

}