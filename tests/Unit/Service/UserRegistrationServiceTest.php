<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service;

use App\Dto\RegistrationRequest;
use App\Entity\User;
use App\Service\UserRegistrationService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserRegistrationServiceTest extends TestCase
{
    private MockObject&EntityManagerInterface $entityManager;
    private MockObject&UserPasswordHasherInterface $passwordHasher;
    private UserRegistrationService $service;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->passwordHasher = $this->createMock(
            UserPasswordHasherInterface::class,
        );
        $this->service = new UserRegistrationService(
            $this->entityManager,
            $this->passwordHasher,
        );
    }

    public function testRegisterCreatesUserWithCorrectEmail(): void
    {
        $request = new RegistrationRequest(
            'test@example.com',
            'password123',
            'password123',
        );

        $this->passwordHasher
            ->expects(self::once())
            ->method('hashPassword')
            ->willReturn('hashed_password');

        $this->entityManager
            ->expects(self::once())
            ->method('persist')
            ->with(self::isInstanceOf(User::class));

        $this->entityManager
            ->expects(self::once())
            ->method('flush');

        $user = $this->service->register($request);

        self::assertSame('test@example.com', $user->getEmail());
        self::assertSame('hashed_password', $user->getPassword());
    }
}
