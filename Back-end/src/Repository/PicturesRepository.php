<?php

namespace App\Repository;

use App\Entity\Pictures;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Pictures>
 */
class PicturesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pictures::class);
    }


    public final function findAllPictures(): array
    {
        $query = $this->createQueryBuilder('p')
            ->getQuery()
            ->getResult();

        return ['pictures' => $query];
    }

    public final function findByUserAndSort($user, string $orderBy = 'ASC'): array
    {
        $query = $this->createQueryBuilder('d')
            ->andWhere('d.user = :user')
            ->setParameter('user', $user)
            ->orderBy('d.createdAt', $orderBy)
            ->getQuery()
            ->getResult();

        return ['pictures' => $query];
    }

    //    /**
    //     * @return Pictures[] Returns an array of Pictures objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Pictures
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
