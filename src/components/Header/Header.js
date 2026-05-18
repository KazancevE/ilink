import { profile } from '../../data/profile';
import headerLogo from '../../img/myPhotoIcon.jpg';
import Vector from '../../img/Vector.png';
import ACADEMY from '../../img/ACADEMY.png';
import './header.css';

export default function Header() {
  const scrollToProfile = () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header__left">
        <img className="header__avatar" src={headerLogo} alt="" />
        <p className="headerUserName">{profile.name}</p>
      </div>
      <div className="header__brand">
        <img src={Vector} className="header__vector" alt="" />
        <img src={ACADEMY} alt="iLink Academy" />
      </div>
      <button type="button" className="btnHeader" onClick={scrollToProfile}>
        <p>Панель управления</p>
      </button>
    </header>
  );
}
