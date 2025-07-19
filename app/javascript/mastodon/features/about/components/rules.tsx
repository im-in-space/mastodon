import { useCallback, useState } from 'react';
import type { ChangeEventHandler, FC } from 'react';

import type { IntlShape } from 'react-intl';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { createSelector } from '@reduxjs/toolkit';
import type { List as ImmutableList } from 'immutable';

import type { SelectItem } from '@/mastodon/components/dropdown_selector';
import type { RootState } from '@/mastodon/store';
import { useAppSelector } from '@/mastodon/store';

import { Section } from './section';

const messages = defineMessages({
  rules: { id: 'about.rules', defaultMessage: 'Server rules' },
  defaultLocale: { id: 'about.default_locale', defaultMessage: 'Default' },
});

// START - im-in.space hardcoded additonal rules
const customRules = {
  bots: [
    {
      id: 1,
      text: 'If the bot posts a lot (like RSS bots with 10+ posts per day), they should not post in the public timeline.',
      hint: '',
    },
    {
      id: 2,
      text: 'They should not randomly follow users and should not mention people unless the bot was explicitly solicited.',
      hint: '',
    },
    {
      id: 3,
      text: 'No NSFW at all.',
      hint: '',
    },
  ],
  crossposting: [
    {
      id: 1,
      text: 'Retweets shouldn\'t be posted in the public timeline. Use a more private privacy rule (like "unlisted" or "private"). Regular tweets and quotes-tweets are not limited.',
      hint: '',
    },
    {
      id: 2,
      text: 'If all you do is shitposting and it gets into the public timelines, you will get silenced, requiring people to follow you to see yours posts. Set a more private privacy rule like said above.',
      hint: '',
    },
  ],
};
// END - im-in.space hardcoded additonal rules

interface RulesSectionProps {
  isLoading?: boolean;
}

interface BaseRule {
  text: string;
  hint: string;
}

interface Rule extends BaseRule {
  id: string;
  translations?: Record<string, BaseRule>;
}

export const RulesSection: FC<RulesSectionProps> = ({ isLoading = false }) => {
  const intl = useIntl();
  const [locale, setLocale] = useState(intl.locale);
  const rules = useAppSelector((state) => rulesSelector(state, locale));
  const localeOptions = useAppSelector((state) =>
    localeOptionsSelector(state, intl),
  );
  const handleLocaleChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      setLocale(e.currentTarget.value);
    },
    [],
  );

  if (isLoading) {
    return <Section title={intl.formatMessage(messages.rules)} />;
  }

  if (rules.length === 0) {
    return (
      <Section title={intl.formatMessage(messages.rules)}>
        <p>
          <FormattedMessage
            id='about.not_available'
            defaultMessage='This information has not been made available on this server.'
          />
        </p>
      </Section>
    );
  }

  return (
    <>
      <Section title={intl.formatMessage(messages.rules)}>
        <ol className='rules-list'>
          {rules.map((rule) => (
            <li key={rule.id}>
              <div className='rules-list__text'>{rule.text}</div>
              {!!rule.hint && (
                <div className='rules-list__hint'>{rule.hint}</div>
              )}
            </li>
          ))}
        </ol>

        <div className='rules-languages'>
          <label htmlFor='language-select'>
            <FormattedMessage
              id='about.language_label'
              defaultMessage='Language'
            />
          </label>
          <select onChange={handleLocaleChange} id='language-select'>
            {localeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                selected={option.value === locale}
              >
                {option.text}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* START - im-in.space hardcoded additonal rules */}
      <Section title={intl.formatMessage(messages.rules) + ' (Bots)'}>
        <ol className='rules-list'>
          {customRules.bots.map((rule) => (
            <li key={rule.id}>
              <div className='rules-list__text'>{rule.text}</div>
              {!!rule.hint && (
                <div className='rules-list__hint'>{rule.hint}</div>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section title={intl.formatMessage(messages.rules) + ' (Crossposting)'}>
        <ol className='rules-list'>
          {customRules.crossposting.map((rule) => (
            <li key={rule.id}>
              <div className='rules-list__text'>{rule.text}</div>
              {!!rule.hint && (
                <div className='rules-list__hint'>{rule.hint}</div>
              )}
            </li>
          ))}
        </ol>
      </Section>
      {/* END - im-in.space hardcoded additonal rules */}
    </>
  );
};

const selectRules = (state: RootState) => {
  const rules = state.server.getIn([
    'server',
    'rules',
  ]) as ImmutableList<Rule> | null;
  if (!rules) {
    return [];
  }
  return rules.toJS() as Rule[];
};

const rulesSelector = createSelector(
  [selectRules, (_state, locale: string) => locale],
  (rules, locale): Rule[] => {
    return rules.map((rule) => {
      const translations = rule.translations;

      // Handle cached responses from earlier versions
      if (!translations) {
        return rule;
      }

      const partialLocale = locale.split('-')[0];
      if (partialLocale && translations[partialLocale]) {
        rule.text = translations[partialLocale].text;
        rule.hint = translations[partialLocale].hint;
      }

      if (translations[locale]) {
        rule.text = translations[locale].text;
        rule.hint = translations[locale].hint;
      }

      return rule;
    });
  },
);

const localeOptionsSelector = createSelector(
  [selectRules, (_state, intl: IntlShape) => intl],
  (rules, intl): SelectItem[] => {
    const langs: Record<string, SelectItem> = {
      default: {
        value: 'default',
        text: intl.formatMessage(messages.defaultLocale),
      },
    };
    // Use the default locale as a target to translate language names.
    const intlLocale = new Intl.DisplayNames(intl.locale, {
      type: 'language',
    });
    for (const { translations } of rules) {
      for (const locale in translations) {
        if (langs[locale]) {
          continue; // Skip if already added
        }
        langs[locale] = {
          value: locale,
          text: intlLocale.of(locale) ?? locale,
        };
      }
    }
    return Object.values(langs);
  },
);
