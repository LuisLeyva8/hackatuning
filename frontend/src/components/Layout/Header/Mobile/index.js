import React from 'react';
import { useDispatch } from 'react-redux';
import { FaCog, FaHome, FaPlus, FaEnvelope } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InvitationCount from '../../../InvitationCount';
import LanguageSwitcher from '../../../LanguageSwitcher';
import { logout } from '../../../../utils/auth';
import { reduxLogout } from '../../../../store/modules/auth/actions';

import { StyledUl, NotificationContianer } from './styles';

export default function Mobile({ count, history }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  async function handleLogout() {
    logout();
    dispatch(reduxLogout());
    history.push('/');
  }

  function handleSettings() {
    const { display } = document.getElementById('ui__sub').style;

    if (!display || display === 'none') {
      document.getElementById('ui__sub').style.display = 'block';
    } else {
      document.getElementById('ui__sub').style.display = 'none';
    }
  }

  return (
    <>
      <NotificationContianer>
        <NavLink to="/app/invitations">
          {count > 0 ? <InvitationCount count={count} /> : null}
          <FaEnvelope color="#1437E3" size={24} />
        </NavLink>
      </NotificationContianer>

      <StyledUl>
        <li>
          <NavLink className="ui__item" to="/" exact activeClassName="selected">
            <FaHome color="#1437E3" size={22} />
            <span>{t('nav.home')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            className="ui__item"
            to="/app/register-hackathon"
            activeClassName="selected"
          >
            <FaPlus color="#1437E3" size={22} />
            <span>{t('nav.add_hackathon')}</span>
          </NavLink>
        </li>
        <li onClick={() => handleSettings()}>
          <div className="ui__item ui__item--relative">
            <FaCog color="#1437E3" size={22} />
            <span>{t('nav.settings')}</span>

            <ul className="ui__sub" id="ui__sub">
              <li className="ui__subitem">
                <NavLink
                  className="ui__sublink"
                  to="/app/settings"
                  activeClassName="selected"
                >
                  {t('nav.edit_profile')}
                </NavLink>
              </li>

              <li className="ui__subitem">
                <a className="ui__sublink" onClick={() => handleLogout()}>
                  {t('nav.logout')}
                </a>
              </li>

              <li className="ui__subitem" style={{ padding: '8px 16px' }}>
                <LanguageSwitcher />
              </li>
            </ul>
          </div>
        </li>
      </StyledUl>
    </>
  );
}
