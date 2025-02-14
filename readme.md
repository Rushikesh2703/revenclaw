# SQL Query Checker

![SQL Query Checker](https://img.shields.io/badge/SQL-Checker-blue?style=for-the-badge)

A powerful **SQL Query Checker & Formatter** that helps detect spelling mistakes, syntax errors, and formatting issues in SQL queries. 🚀

## ✨ Features

✅ **Real-time spell checking** for SQL keywords  
✅ **SQL syntax validation** (e.g., missing semicolons, unmatched parentheses, incorrect `JOIN` usage)  
✅ **Auto-formatting** for cleaner and more readable SQL queries  
✅ **CodeMirror Integration** for a smooth editing experience  
✅ **Supports MySQL syntax checking**  
✅ **Interactive error highlighting**  

## 🚀 Usage
1. **Enter your SQL query** in the editor.
2. **Errors will be highlighted** in real-time.
3. Click **Format SQL** to clean up your query.
4. Click **Clear Editor** to reset the input.

## 📝 Example Queries
### ✅ **Correct Query**
```sql
SELECT name, email FROM users WHERE id = 1;
```
✔ No issues found!

### ❌ **Query with Errors**
```sql
SELCT name, email FRM users WHER id = 1
```
❌ Misspelled keywords: `SELCT` → `SELECT`, `FRM` → `FROM`, `WHER` → `WHERE`  
❌ Missing semicolon at the end of the query

## 🛠 Technologies Used
- **JavaScript** (CodeMirror for syntax highlighting)
- **HTML & CSS** (Frontend UI)
- **MySQL Query Checking**

