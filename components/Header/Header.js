import Link from 'next/link'
import styles from  "./Header.scss"

const linkStyle = {
  marginRight: 15
}

const Header = () => (
    <div className={styles.example}>
        <Link href="/">
          <a style={linkStyle}>Home</a>
        </Link>
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
    </div>
)

export default Header