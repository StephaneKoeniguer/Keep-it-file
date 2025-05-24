<?php

namespace App\Entity;

use App\Repository\SharedResourceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SharedResourceRepository::class)]
class SharedResource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $resourceId = null;

    #[ORM\Column(length: 255, unique: true, nullable: true)]
    private ?string $token = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $expirationDate = null;

    public final function getId(): ?int
    {
        return $this->id;
    }

    public final function getResourceId(): ?int
    {
        return $this->resourceId;
    }

    public final function setResourceId(?int $resourceId): static
    {
        $this->resourceId = $resourceId;

        return $this;
    }

    public final function getToken(): ?string
    {
        return $this->token;
    }

    public final function setToken(?string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public final function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public final function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public final function getExpirationDate(): ?\DateTimeImmutable
    {
        return $this->expirationDate;
    }

    public final function setExpirationDate(?\DateTimeImmutable $expirationDate): static
    {
        $this->expirationDate = $expirationDate;

        return $this;
    }
}
