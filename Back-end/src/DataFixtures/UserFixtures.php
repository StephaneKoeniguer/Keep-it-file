<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{

    public function __construct(private readonly UserPasswordHasherInterface $passwordHasher){}


    public final function load(ObjectManager $manager): void
    {
        $users = [
            [   'email'         => 'john.Doe@gmail.com',
                'roles'         => ['ROLE_ADMIN'],
                'password'      => 'password123',
                'description'   => 'Administrateur système avec des responsabilités globales. Gère l\'accès et la sécurité.',
                'fullName'      => 'John Doe',
            ],
            [   'email'         => 'jane.Doe@gmail.com',
                'roles'         => ['ROLE_USER'],
                'password'      => 'password123',
                'description'   => 'Utilisateur standard. Accès aux fonctionnalités de base et gestion de son propre compte.',
                'fullName'      => 'Jane Doe',
            ],
        ];

        foreach ($users as $userData) {
            $user = $this->createUser($userData['email'], $userData['roles'], $userData['password'], $userData['description'], $userData['fullName']);
            $manager->persist($user);
        }

        $manager->flush();
    }

    private function createUser(string $email, array $roles, string $plainPassword, string $description, string $fullName): User
    {
        $user = new User();
        $user->setEmail($email);
        $user->setRoles($roles);
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));
        $user->setDescription($description);
        $user->setFullName($fullName);

        return $user;
    }

}
