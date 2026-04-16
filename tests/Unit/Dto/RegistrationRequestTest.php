<?php

declare(strict_types=1);

namespace App\Tests\Unit\Dto;

use App\Dto\RegistrationRequest;
use PHPUnit\Framework\TestCase;

final class RegistrationRequestTest extends TestCase
{
    public function testConstructorSetsProperties(): void
    {
        $dto = new RegistrationRequest(
            'test@example.com',
            'password123',
            'password123',
        );

        self::assertSame('test@example.com', $dto->email);
        self::assertSame('password123', $dto->password);
        self::assertSame('password123', $dto->passwordConfirmation);
    }
}
