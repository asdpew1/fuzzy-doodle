<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\RegistrationRequest;
use App\Service\UserRegistrationService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsController]
final class RegistrationController
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly UserRegistrationService $registrationService,
    ) {
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        /** @var array{email?: string, password?: string, passwordConfirmation?: string} $data */
        $data = json_decode($request->getContent(), true) ?? [];

        $dto = new RegistrationRequest(
            email: $data['email'] ?? '',
            password: $data['password'] ?? '',
            passwordConfirmation: $data['passwordConfirmation'] ?? '',
        );

        $errors = $this->validator->validate($dto);

        if (\count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()]
                    = (string) $error->getMessage();
            }

            return new JsonResponse(
                ['errors' => $errorMessages],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        try {
            $user = $this->registrationService->register($dto);
        } catch (UniqueConstraintViolationException) {
            return new JsonResponse(
                ['error' => 'Email already registered'],
                Response::HTTP_CONFLICT,
            );
        }

        return new JsonResponse(
            ['id' => $user->getId(), 'email' => $user->getEmail()],
            Response::HTTP_CREATED,
        );
    }
}
