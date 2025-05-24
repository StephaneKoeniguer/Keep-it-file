<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UsersController extends AbstractController
{
    /**
     * Fetches users
     * @param Request $request
     * @param UserRepository $userRepository
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    #[Route('/api/users', name: 'app_users', methods: ['GET'])]
    #[isGranted('ROLE_ADMIN')]
    public function getUsers(Request $request, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Retrieving pagination parameters from the request
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);
        $UserList = $userRepository->findAllWidthPagination($page, $limit);
        $users = $serializer->normalize($UserList['users'], null, ['groups' => 'getUsers']);

        $response = [
            'users'         => $users,
            'totalItems'    => $UserList['totalItems'],
            'totalPages'    => $UserList['totalPages'],
        ];

        return new JsonResponse($response, Response::HTTP_OK);
    }

    /**
     * Fetch user information
     * @param UserRepository $userRepository
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    #[Route('/api/users/infos', name: 'app_users_infos', methods: ['POST'])]
    public function getUserInfos(UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {

        $user = $this->getUser();
        $userDatabase = $userRepository->findOneBy(['email' => $user->getEmail()]);
        $users = $serializer->normalize($userDatabase, null, ['groups' => 'getUsers']);
        $response = ['user' => $users];

        return new JsonResponse($response, Response::HTTP_OK);
    }

    /**
     * Register a new user
     * @param Request $request
     * @param UserPasswordHasherInterface $passwordHasher
     * @param ValidatorInterface $validator
     * @param SerializerInterface $serializer
     * @param UserRepository $userRepository
     * @param EntityManagerInterface $em
     * @return JsonResponse
     */
    #[Route('/api/users/register', name: 'app_users_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher,
                             ValidatorInterface $validator, SerializerInterface $serializer,
                             UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Mandatory field validation
        if (empty($data['email']) || empty($data['password'])) {
            return new JsonResponse(['message' => 'Email and password must not be blank'], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already exists
        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['message' => "User already exist"], Response::HTTP_BAD_REQUEST);
        }

        // Create new user
        $user = new User();
        $user->setEmail($data['email'])
            ->setPassword($passwordHasher->hashPassword($user,$data['password']));

        in_array('ROLE_ADMIN', $data['roles']) ? $user->setRoles(['ROLE_ADMIN']) : $user->setRoles(['ROLE_USER']);

        // Check constraints on the entity
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => "User created"], Response::HTTP_CREATED);
    }

    /**
     * Update user
     * @param Request $request
     * @param ValidatorInterface $validator
     * @param SerializerInterface $serializer
     * @param UserRepository $userRepository
     * @param EntityManagerInterface $em
     * @return JsonResponse
     */
    #[Route('/api/users/update', name: 'app_users_update', methods: ['POST'])]
    #[isGranted('ROLE_USER')]
    public function update(Request $request, ValidatorInterface $validator, SerializerInterface $serializer,
                             UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = $this->getUser();
        // Check if user already exists
        $existingUser = $userRepository->findOneBy(['email' => $user->getEmail()]);
        if (!$existingUser) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Clean data
        $description = !empty($data["description"]) ? trim($data["description"]) : $existingUser->getDescription();
        $fullName = !empty($data["name"]) ? trim($data["name"]) : $existingUser->getFullName();
        $description = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
        $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');

        $existingUser->setDescription($description);
        $existingUser->setFullName($fullName);

        // Check constraints on the entity
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return new JsonResponse($serializer->serialize($errors, 'json'), Response::HTTP_BAD_REQUEST);
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => "User updated"], Response::HTTP_OK);
    }

}
