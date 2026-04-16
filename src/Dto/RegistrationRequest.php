<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class RegistrationRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,
        #[Assert\NotBlank]
        #[Assert\Length(min: 8, max: 4096)]
        public string $password,
        #[Assert\NotBlank]
        #[Assert\IdenticalTo(
            propertyPath: 'password',
            message: 'Passwords do not match.',
        )]
        public string $passwordConfirmation,
    ) {
    }
}
