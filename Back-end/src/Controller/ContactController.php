<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

final class ContactController extends AbstractController
{
    /**
     * Send mail with mailer symfony
     * @throws TransportExceptionInterface
     */
    #[Route('/api/contact', name: 'app_contact', methods: ['POST'])]
    public function contact(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['email'], $data['message'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        $email = (new Email())
            ->from($data['email'])
            ->to('keepitfile@support.com')
            ->subject('Nouveau message depuis le formulaire de contact')
            ->text(sprintf(
                "Nom : %s\nEmail : %s\n\nMessage :\n%s",
                $data['name'],
                $data['email'],
                $data['message']
            ));

        $mailer->send($email);

        return new JsonResponse(['message' => 'Email sent successfully']);
    }
}
