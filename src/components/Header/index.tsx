import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.headerContent}>
        <Link href="/" legacyBehavior={true}>
          <a href="/"><img src="/images/logo.svg" alt="logo" /></a>
        </Link>
      </div>
    </header>
  );
}
