import React from 'react';
import { useDispatch } from 'react-redux';
import { FaEnvelope, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '../../../../utils/auth';
import { reduxLogout } from '../../../../store/modules/auth/actions';

import InvitationCount from '../../../InvitationCount';
import LanguageSwitcher from '../../../LanguageSwitcher';
import { TabLink, StyledUl } from './styles';

export default function Desktop({ count, history }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  async function handleLogout() {
    logout();
    dispatch(reduxLogout());
    history.push('/');
  }

  return (
    <StyledUl>
      <li>
        <Link to="/app/register-hackathon" className="create_hackathon">
          {t('nav.create_hackathon')}
        </Link>
      </li>
      <li>
        <TabLink
          to="/app/hackathons"
          className="left"
          activeClassName="selected"
        >
          {t('nav.hackathons')}
        </TabLink>
        <TabLink to="/app/teams" className="right" activeClassName="selected">
          {t('nav.teams')}
        </TabLink>
      </li>
      <li className="notification_container">
        <Link to="/app/invitations">
          {count > 0 ? <InvitationCount count={count} /> : null}
          <FaEnvelope color="#1437E3" size={24} />
        </Link>
      </li>
      <li>
        <Link to="/app/settings">
          <FaCog color="#1437E3" size={24} />
        </Link>
      </li>
      <li>
        <LanguageSwitcher />
      </li>
      <li className="logout" onClick={() => handleLogout()}>
        {t('nav.logout')}
      </li>
    </StyledUl>
  );
}
