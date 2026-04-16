<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\RegistrationRequest;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final readonly class UserRegistrationService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function register(RegistrationRequest $request): User
    {
        $user = new User();
        $user->setEmail($request->email);
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, $request->password)
        );

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
