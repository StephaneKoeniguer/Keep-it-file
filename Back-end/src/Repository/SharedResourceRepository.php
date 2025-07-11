<?php

namespace App\Repository;

use App\Entity\SharedResource;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SharedResource>
 */
class SharedResourceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SharedResource::class);
    }

    /**
     * Find link shares expired
     * @param \DateTimeImmutable $currentDate
     * @return array
     */
    public final function findExpiredShares(\DateTimeImmutable $currentDate): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.expirationDate < :currentDate')
            ->setParameter('currentDate', $currentDate)
            ->getQuery()
            ->getResult();
    }


    //    /**
    //     * @return SharedResource[] Returns an array of SharedResource objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?SharedResource
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
