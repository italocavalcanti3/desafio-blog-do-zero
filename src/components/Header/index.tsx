import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}
