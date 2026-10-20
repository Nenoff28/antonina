# Антонина Петрова — преносим статичен сайт

В корена на това публично repository се намира готова статична версия. HTML, CSS, JavaScript, изображенията, оригиналните PNG логотипи, дипломи и шрифтове са локални; ресурсните URL-и са относителни, така че да работят и под `/antonina/` или в друга подпапка. Готовият generic export не съдържа host-specific canonical адрес.

- Основна live версия: https://antonina-4dz3flgt.manus.space/
- GitHub repository: https://github.com/Nenoff28/antonina

**GitHub Pages още не е активиран.** Свързаното разрешение върна HTTP 403 при заявката за включването му. За да публикувате копието и през GitHub Pages: `Settings → Pages → Build and deployment → Deploy from a branch`, branch `main`, folder `/(root)`, после `Save`. Очакваният URL след успешно включване е `https://nenoff28.github.io/antonina/`.

За индексиране в търсачки от нов хост задайте истинския базов HTTPS адрес (включително подпапка) на `publicOrigin` във файла `content/site.json` от пълния проект и изпълнете offline build-а преди качване. Иначе portable export умишлено няма canonical/sitemap адрес към предишен хост.
