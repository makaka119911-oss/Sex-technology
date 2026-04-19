-- Этап 8: тематика сексологов — категории и деликатные описания

update public.products
set
  name = 'Средство для интимной гигиены',
  description = 'Мягкая формула с соблюдением pH-баланса; для ежедневного деликатного ухода.',
  category = 'Интим-аксессуары'
where name = 'Интимная гигиена';

update public.products
set
  description = 'Для расслабляющего массажа и ухода за кожей; без навязчивого аромата, подходит для чувствительной кожи.',
  category = 'Интим-аксессуары'
where name = 'Массажное масло';

update public.products
set
  name = 'Компактный вибромассажёр',
  description = 'Несколько режимов интенсивности, тихая работа; эргономичная форма для индивидуального комфорта.',
  category = 'Интим-аксессуары'
where name = 'Игрушка-классика';

update public.products
set
  description = 'Набор 12 шт.; надёжная защита и комфорт при использовании.',
  category = 'Интим-аксессуары'
where name = 'Презервативы премиум';

update public.products
set
  description = 'Гипоаллергенный состав, 100 мл; совместим с презервативами и аксессуарами из безопасных материалов.',
  category = 'Интим-аксессуары'
where name = 'Лубрикант на водной основе';

update public.products
set
  description = 'Продуманный подарочный набор для двоих: предметы для совместного отдыха и нежного ухода друг за другом.',
  category = 'Подарочные наборы'
where name = 'Набор «Нежность»';

insert into public.products (name, description, price, category, image_url, in_stock)
select
  'Книга «Тело и близость»',
  'Научно-популярное издание о женской сексуальности, границах и близости в паре — в уважительном, безвульгарном тоне.',
  1490.00,
  'Книги и образовательные материалы',
  '/images/shop/placeholder.svg',
  true
where not exists (
  select 1 from public.products p where p.name = 'Книга «Тело и близость»'
);

insert into public.products (name, description, price, category, image_url, in_stock)
select
  'Сертификат на консультацию сексолога',
  'Электронный сертификат на индивидуальную сессию; срок действия и запись согласуются с вами после оплаты.',
  5000.00,
  'Сертификаты на терапию',
  '/images/shop/placeholder.svg',
  true
where not exists (
  select 1 from public.products p where p.name = 'Сертификат на консультацию сексолога'
);
