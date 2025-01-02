import { observer } from 'mobx-react-lite';
import { Link } from 'wouter';

export const AboutPageView = observer(() => {
  return (
    <div className={'text-lg leading-6 flex flex-col gap-2'}>
      <p>
        Проект был разработан в личных целях, чтобы удобно трекать время,
        которое я тратил во время фриланс разработки. Безусловно есть трекеры и
        получше, но в рамках этого проекта я пощупал shadcn-ui с tailwind, что
        дало некий опыт
      </p>
      <p>
        Автор:{' '}
        <a className={'text-link'} href={'https://github.com/js2me'}>
          Сергей Волков
        </a>
      </p>
      <p>
        Также есть старая версия проекта, написанная на <b>effector</b> - можно
        поглядеть исходный код{' '}
        <a
          className={'text-link'}
          href={
            'https://github.com/js2me/time-tracker-app/tree/effecctor-version/src'
          }
        >
          тут
        </a>
      </p>
      <p>
        Новая версия написана на <b>MobX</b> - можно поглядеть исходный код{' '}
        <a
          className={'text-link'}
          href={'https://github.com/js2me/time-tracker-app/tree/master/src'}
        >
          тут
        </a>
      </p>
      <p className={'mb-2'}>Спасибо за внимание:)</p>
      <Link to={'/'} className={'text-link'}>
        Назад
      </Link>
    </div>
  );
});
