<?php

namespace App\Command;

use App\Repository\SharedResourceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PurgeExpiredSharesCommand extends Command
{
    private SharedResourceRepository $shareRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(SharedResourceRepository $shareRepository, EntityManagerInterface $entityManager)
    {
        parent::__construct('app:purge-expired-shares');
        $this->shareRepository = $shareRepository;
        $this->entityManager = $entityManager;
    }

    protected final function configure(): void
    {
        $this->setDescription('Purge les partages expirés.');
        $this->setHelp('Cette commande permet de supprimer les partages qui ont expiré.');
    }

    protected final function execute(InputInterface $input, OutputInterface $output): int
    {
        $expiredShares = $this->shareRepository->findExpiredShares(new \DateTimeImmutable());

        foreach ($expiredShares as $share) {
            $this->entityManager->remove($share);
        }

        $this->entityManager->flush();

        $output->writeln(count($expiredShares) . ' liens purgés.');

        return Command::SUCCESS;
    }
}