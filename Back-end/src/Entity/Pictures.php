<?php

namespace App\Entity;

use App\Repository\PicturesRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;

#[ORM\Entity(repositoryClass: PicturesRepository::class)]
class Pictures
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["getPictures"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Title is required")]
    #[Assert\Length(min: 1, max: 255, minMessage: "The title must be at least {{ limit }} characters long", maxMessage: "The title cannot be longer than {{ limit }} characters")]
    #[Groups(["getPictures"])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(["getPictures"])]
    private ?float $size = null;

    #[ORM\Column(length: 255)]
    #[Groups(["getPictures"])]
    private ?string $path = null;

    #[ORM\Column]
    #[Groups(["getPictures"])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(["getPictures"])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    #[Groups(["getPictures"])]
    private ?User $user = null;

    #[Assert\File(
        maxSize: '10M',
        mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
        mimeTypesMessage: "The file must be in JPG/JPEG/PNG and must not exceed 10 MB."
    )]
    private ?File $file = null;

    public final function getId(): ?int
    {
        return $this->id;
    }

    public final function getName(): ?string
    {
        return $this->name;
    }

    public final function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public final function getSize(): ?float
    {
        return $this->size;
    }

    public final function setSize(float $size): static
    {
        $this->size = $size;

        return $this;
    }

    public final function getPath(): ?string
    {
        return $this->path;
    }

    public final function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }

    public final function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public final function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public final function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public final function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public final function getUser(): ?User
    {
        return $this->user;
    }

    public final function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public final function getFile(): ?File
    {
        return $this->file;
    }

    public final function setFile(?File $file): self
    {
        $this->file = $file;
        return $this;
    }
}
