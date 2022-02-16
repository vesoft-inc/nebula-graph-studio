import React, { useContext } from 'react';
import { Select } from 'antd';
import { INTL_LOCALE_SELECT } from '@appv2/config';
import Icon from '@appv2/components/Icon';
import { LanguageContext } from '@appv2/context';

import './index.less';
const Option = Select.Option;

const LanguageSelect: React.FC = () => {
  const { currentLocale, toggleLanguage } = useContext(LanguageContext);
  return (
    <Select
      className="select-lang"
      size="small"
      value={currentLocale}
      onChange={toggleLanguage}
      optionLabelProp="label"
    >
      {Object.keys(INTL_LOCALE_SELECT).map(locale => (
        <Option
          className="dark"
          key={locale}
          value={INTL_LOCALE_SELECT[locale].NAME}
          label={
            <div className="select-label">
              <Icon type="icon-login-Language" />
              {INTL_LOCALE_SELECT[locale].TEXT}
            </div>
          }
        >
          {INTL_LOCALE_SELECT[locale].TEXT}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSelect;
