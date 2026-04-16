<?php

declare(strict_types=1);

namespace App\Tests\Unit\Controller;

use App\Controller\RegistrationController;
use App\Service\UserRegistrationService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\Stub;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class RegistrationControllerTest extends TestCase
{
    private Stub&ValidatorInterface $validator;
    private Stub&EntityManagerInterface $entityManager;
    private Stub&UserPasswordHasherInterface $passwordHasher;
    private RegistrationController $controller;

    protected function setUp(): void
    {
        $this->validator = $this->createStub(ValidatorInterface::class);
        $this->entityManager = $this->createStub(EntityManagerInterface::class);
        $this->passwordHasher = $this->createStub(
            UserPasswordHasherInterface::class,
        );
        $registrationService = new UserRegistrationService(
            $this->entityManager,
            $this->passwordHasher,
        );
        $this->controller = new RegistrationController(
            $this->validator,
            $registrationService,
        );
    }

    public function testSuccessfulRegistrationReturns201(): void
    {
        $request = new Request(
            content: json_encode([
                'email' => 'test@example.com',
                'password' => 'password123',
                'passwordConfirmation' => 'password123',
            ], \JSON_THROW_ON_ERROR),
        );

        $this->validator
            ->method('validate')
            ->willReturn(new ConstraintViolationList());

        $this->passwordHasher
            ->method('hashPassword')
            ->willReturn('hashed_password');

        $response = ($this->controller)($request);

        self::assertSame(Response::HTTP_CREATED, $response->getStatusCode());

        /** @var array<string, mixed> $data */
        $data = json_decode(
            (string) $response->getContent(),
            true,
            512,
            \JSON_THROW_ON_ERROR,
        );
        self::assertSame('test@example.com', $data['email']);
    }

    public function testValidationErrorsReturn422(): void
    {
        $request = new Request(
            content: json_encode([
                'email' => '',
                'password' => '',
                'passwordConfirmation' => '',
            ], \JSON_THROW_ON_ERROR),
        );

        $violation = new ConstraintViolation(
            'This value should not be blank.',
            null,
            [],
            '',
            'email',
            '',
        );

        $this->validator
            ->method('validate')
            ->willReturn(new ConstraintViolationList([$violation]));

        $response = ($this->controller)($request);

        self::assertSame(
            Response::HTTP_UNPROCESSABLE_ENTITY,
            $response->getStatusCode(),
        );

        /** @var array<string, array<string, string>> $data */
        $data = json_decode(
            (string) $response->getContent(),
            true,
            512,
            \JSON_THROW_ON_ERROR,
        );
        self::assertArrayHasKey('errors', $data);
        self::assertArrayHasKey('email', $data['errors']);
    }

    public function testDuplicateEmailReturns409(): void
    {
        $request = new Request(
            content: json_encode([
                'email' => 'test@example.com',
                'password' => 'password123',
                'passwordConfirmation' => 'password123',
            ], \JSON_THROW_ON_ERROR),
        );

        $this->validator
            ->method('validate')
            ->willReturn(new ConstraintViolationList());

        $this->passwordHasher
            ->method('hashPassword')
            ->willReturn('hashed_password');

        $this->entityManager
            ->method('flush')
            ->willThrowException(
                $this->createStub(UniqueConstraintViolationException::class),
            );

        $response = ($this->controller)($request);

        self::assertSame(Response::HTTP_CONFLICT, $response->getStatusCode());

        /** @var array<string, mixed> $data */
        $data = json_decode(
            (string) $response->getContent(),
            true,
            512,
            \JSON_THROW_ON_ERROR,
        );
        self::assertSame('Email already registered', $data['error']);
    }
}
