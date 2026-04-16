<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

final class UserTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        $this->user = new User();
    }

    public function testGetIdReturnsNullWhenNotPersisted(): void
    {
        self::assertNull($this->user->getId());
    }

    public function testSetAndGetEmail(): void
    {
        $result = $this->user->setEmail('test@example.com');

        self::assertSame('test@example.com', $this->user->getEmail());
        self::assertSame($this->user, $result);
    }

    public function testGetUserIdentifierReturnsEmail(): void
    {
        $this->user->setEmail('test@example.com');

        self::assertSame('test@example.com', $this->user->getUserIdentifier());
    }

    public function testGetUserIdentifierReturnsEmptyStringWhenEmailIsNull(): void
    {
        self::assertSame('', $this->user->getUserIdentifier());
    }

    public function testGetRolesAlwaysIncludesRoleUser(): void
    {
        self::assertContains('ROLE_USER', $this->user->getRoles());
    }

    public function testSetAndGetRoles(): void
    {
        $result = $this->user->setRoles(['ROLE_ADMIN']);

        self::assertSame(['ROLE_ADMIN', 'ROLE_USER'], $this->user->getRoles());
        self::assertSame($this->user, $result);
    }

    public function testGetRolesDeduplicates(): void
    {
        $this->user->setRoles(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_USER']);

        $roles = $this->user->getRoles();

        self::assertCount(2, $roles);
        self::assertContains('ROLE_USER', $roles);
        self::assertContains('ROLE_ADMIN', $roles);
    }

    public function testSetAndGetPassword(): void
    {
        $result = $this->user->setPassword('hashed_password');

        self::assertSame('hashed_password', $this->user->getPassword());
        self::assertSame($this->user, $result);
    }

    public function testEraseCredentialsDoesNotThrow(): void
    {
        $this->user->eraseCredentials();

        $this->expectNotToPerformAssertions();
    }
}
