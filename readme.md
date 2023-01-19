# Получаем и выводим весь список контактов в виде таблицы (console.table)
node index.js --action list

[<img src="assets/images/result%201.png" width="830"/>](assets/images/result%201.png)

# Получаем контакт по id
node index.js --action get --id 5

[<img src="assets/images/result%202.png" width="830"/>](assets/images/result%202.png)

# Добавялем контакт
node index.js --action add --name Mango --email mango@gmail.com --phone 322-22-22

[<img src="assets/images/result%203.png" width="830"/>](assets/images/result%203.png)

# Удаляем контакт
node index.js --action remove --id=3

[<img src="assets/images/result%204.png" width="830"/>](assets/images/result%204.png)
