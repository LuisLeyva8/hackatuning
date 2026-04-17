import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SwitcherBtn = styled.button`
  background: none;
  border: 1.5px solid #1437e3;
  border-radius: 4px;
  padding: 2px 9px;
  cursor: pointer;
  color: #1437e3;
  font-weight: bold;
  font-size: 12px;
  line-height: 1.4;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #1437e3;
    color: #fff;
  }
`;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language && i18n.language.startsWith('es');

  function toggle() {
    i18n.changeLanguage(isSpanish ? 'en' : 'es');
  }

  return <SwitcherBtn onClick={toggle}>{isSpanish ? 'EN' : 'ES'}</SwitcherBtn>;
}
