import { profile } from '../../data/profile';
import { getAgeFromDOB } from '../../utils/getAge';
import './profileCard.css';

export default function ProfileCard() {
  const age = getAgeFromDOB(profile.dob);

  return (
    <section className="profile" id="profile">
      <div className="profile__layout">
        <img className="profile__photo" src={profile.photo} alt={profile.name} />
        <article className="block">
          <div className="blockTitle">
            <h3>{profile.name}</h3>
            <p>{profile.dob}</p>
          </div>
          <div className="blockInfo">
            <p>
              <strong>Город:</strong> {profile.city}
            </p>
            <p>
              <strong>Пол:</strong> {profile.gender}
            </p>
            <p>
              <strong>Возраст:</strong> {age}
            </p>
          </div>
          <div className="blockMySelf">
            <p>
              <strong>О себе:</strong> {profile.about}
            </p>
          </div>
          <p>
            <strong>Домашнее животное:</strong> {profile.pet}
          </p>
        </article>
      </div>
    </section>
  );
}
