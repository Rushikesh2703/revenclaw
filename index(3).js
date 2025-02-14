// Initialize CodeMirror
document.addEventListener("DOMContentLoaded", function () {
    const sqlInput = document.getElementById("sqlInput");
    const errorList = document.getElementById("errorList");
    const formatBtn = document.getElementById("formatBtn");
    const clearBtn = document.getElementById("clearBtn");

    sqlInput.addEventListener("input", validateSQL);
    formatBtn.addEventListener("click", formatSQL);
    clearBtn.addEventListener("click", clearSQL);

    // ✅ List of valid SQL keywords
    const validSQLKeywords = new Set([
        "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
        "CREATE", "TABLE", "DROP", "ALTER", "ADD", "COLUMN", "ORDER", "BY", "GROUP",
        "HAVING", "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "ON", "AS", "AND", "OR",
        "NOT", "NULL", "DISTINCT", "LIMIT", "OFFSET", "UNION", "CASE", "WHEN", "THEN",
        "ELSE", "END", "EXISTS", "BETWEEN", "LIKE", "IN", "COUNT", "AVG", "SUM", "MIN",
        "MAX", "ASC", "DESC", "PRIMARY", "FOREIGN", "KEY", "CONSTRAINT", "DEFAULT",
        "CHECK", "REFERENCES", "INDEX", "VIEW", "TRIGGER"
    ]);

    function validateSQL() {
        const query = sqlInput.value.trim();
        errorList.innerHTML = ""; // Clear previous errors

        if (query === "") return;

        let errors = [];

        // ✅ Split SQL statements & validate each one
        const statements = query.split(";").map(stmt => stmt.trim()).filter(stmt => stmt !== "");

        statements.forEach(statement => {
            const words = statement.replace(/[^a-zA-Z0-9_]/g, " ").split(/\s+/);
            let firstWord = words[0]?.toUpperCase();
            let hasFrom = words.includes("FROM") || words.includes("from");

            // ✅ Check for missing required SQL parts
            if (firstWord === "SELECT" && !hasFrom) {
                errors.push({
                    error: `Missing "FROM" clause in SELECT statement.`,
                    fix: `${statement} FROM table_name;`
                });
            }
            if (firstWord === "DELETE" && !hasFrom) {
                errors.push({
                    error: `Missing "FROM" clause in DELETE statement.`,
                    fix: `${statement} FROM table_name;`
                });
            }
            if (firstWord === "UPDATE" && !words.includes("SET")) {
                errors.push({
                    error: `Missing "SET" clause in UPDATE statement.`,
                    fix: `${statement} SET column_name = value;`
                });
            }
            if (firstWord === "INSERT" && !words.includes("VALUES")) {
                errors.push({
                    error: `Missing "VALUES" in INSERT statement.`,
                    fix: `${statement} VALUES (value1, value2);`
                });
            }
            if (firstWord === "FROM") {
                errors.push({
                    error: `"FROM" cannot be the first keyword in an SQL statement.`,
                    fix: `Rewrite the query starting with SELECT or DELETE.`
                });
            }

            // ✅ Ignore table names and column names
            let sqlKeywordsUsed = words.filter(word => validSQLKeywords.has(word.toUpperCase()));

            words.forEach(word => {
                const upperWord = word.toUpperCase();
                if (!validSQLKeywords.has(upperWord) && isNaN(word) && word !== "" && !sqlKeywordsUsed.includes(upperWord)) {
                    // This means the word is **not an SQL keyword**, **not a number**, and **not empty** (possible table/column name)
                    if (sqlKeywordsUsed.length > 0) {
                        // It's likely a **table/column name**, so ignore it.
                    } else {
                        // If no SQL keywords exist in the query, this is an invalid SQL statement.
                        errors.push({
                            error: `Invalid SQL keyword: "${word}" is not a recognized SQL keyword.`,
                            fix: `Check the spelling of "${word}" or ensure it's a valid table/column name.`
                        });
                    }
                }
            });

            // ✅ Check for missing semicolon (only for last statement)
            if (!query.endsWith(";")) {
                errors.push({
                    error: "Missing semicolon (;)",
                    fix: query + ";"
                });
            }
        });

        // ✅ Step 2: Display errors
        if (errors.length > 0) {
            errors.forEach(err => {
                const errorItem = document.createElement("div");
                errorItem.classList.add("list-group-item", "list-group-item-danger");
                errorItem.innerHTML = `<strong>Error:</strong> ${err.error} <br><strong>Suggested Fix:</strong> <code>${err.fix}</code>`;
                errorList.appendChild(errorItem);
            });
        } else {
            const successItem = document.createElement("div");
            successItem.classList.add("list-group-item", "list-group-item-success");
            successItem.innerText = "No errors found!";
            errorList.appendChild(successItem);
        }
    }

    function formatSQL() {
        let formattedQuery = sqlInput.value.trim();

        // ✅ Auto-correct known typos
        const keywordFixes = {
            "fro": "FROM",
            "wher": "WHERE",
            "selec": "SELECT",
            "insto": "INSERT INTO",
            "delte": "DELETE",
            "updat": "UPDATE",
            "valuess": "VALUES",
            "cretae": "CREATE",
            "dropo": "DROP",
            "aler": "ALTER"
        };

        Object.keys(keywordFixes).forEach(wrongWord => {
            const regex = new RegExp(`\\b${wrongWord}\\b`, "gi");
            formattedQuery = formattedQuery.replace(regex, keywordFixes[wrongWord]);
        });

        // ✅ Ensure a semicolon at the end
        if (!formattedQuery.endsWith(";")) {
            formattedQuery += ";";
        }

        sqlInput.value = formattedQuery;
        validateSQL(); // Revalidate after formatting
    }

    function clearSQL() {
        sqlInput.value = "";
        errorList.innerHTML = "";
    }
});




// Elements
const errorList = document.getElementById('errorList');
const formatBtn = document.getElementById('formatBtn');
const clearBtn = document.getElementById('clearBtn');

let checkTimeout;

// SQL keyword dictionary for spell checking
const sqlKeywords = new Map([
    ['CREAT', 'CREATE'], ['SELCT', 'SELECT'],['SELEC', 'SELECT'], ['WHER', 'WHERE'], ['DELET', 'DELETE'],
    ['UPDAT', 'UPDATE'], ['INSRT', 'INSERT'], ['FRM', 'FROM'], ['TABL', 'TABLE'],
    ['DATABAS', 'DATABASE'], ['COLUM', 'COLUMN'], ['GROOP', 'GROUP'], ['ORDR', 'ORDER'],
    ['JOINNG', 'JOIN'], ['HAVNG', 'HAVING'], ['DISTINCTT', 'DISTINCT'], ['UNOIN', 'UNION'],
    ['VALU', 'VALUES'],['creat', 'CREATE'], ['selct', 'SELECT'],['selec', 'SELECT'], ['wher', 'WHERE'], ['delet', 'DELETE'],
    ['updat', 'UPDATE'], ['insrt', 'INSERT'], ['frm', 'FROM'], ['tabl', 'TABLE'],
    ['databas', 'DATABASE'], ['colum', 'COLUMN'], ['groop', 'GROUP'], ['ordr', 'ORDER'],
    ['joining', 'JOIN'], ['havng', 'HAVING'], ['distinctt', 'DISTINCT'], ['unoin', 'UNION'],
    ['valu', 'VALUES']
]);

// Function to format SQL query
function formatSQL(sql) {
    sqlKeywords.forEach((correct, misspelled) => {
        const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
        sql = sql.replace(regex, correct);
    });

    return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*([,()])\s*/g, '$1 ')
        .replace(/\(/g, '\n(')
        .replace(/\)/g, ')\n')
        .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|VALUES)\b/gi, '\n$1')
        .replace(/\b(LEFT|RIGHT|INNER|OUTER|CROSS|FULL)?\s*JOIN\b/gi, '\n$1 JOIN')
        .replace(/\b(AND|OR)\b/gi, '\n  $1')
        .replace(/\b(INSERT|UPDATE|DELETE)\b/gi, '\n$1')
        .replace(/\bSET\b/gi, '\nSET')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

// Function to check SQL query for errors
function checkQuery() {
    const query = editor.getValue().trim();
    const errors = [];

    // Check for misspelled SQL keywords
    const misspelledWords = spellCheckSQL(query);
    misspelledWords.forEach(({ word, correct }) => {
        errors.push({
            message: `Misspelled keyword: ${word}`,
            suggestion: `Did you mean: ${correct}?`,
            severity: "error"
        });
    });

    // Check if query ends with a semicolon
    if (query.length > 0 && !query.endsWith(';')) {
        errors.push({
            message: "Missing semicolon at the end of the query",
            suggestion: "Ensure your query ends with a ';'",
            severity: "error"
        });
    }

    // Check for incomplete CREATE TABLE statements
    if (/CREATE TABLE\s+\w+(\s*\(.*\))?/i.test(query) && !query.includes('(')) {
        errors.push({
            message: "Incomplete CREATE TABLE statement",
            suggestion: "Ensure you define columns within parentheses, e.g., CREATE TABLE users (id INT, name VARCHAR(255));",
            severity: "error"
        });
    }

    // Check for unmatched parentheses
    const openParens = (query.match(/\(/g) || []).length;
    const closeParens = (query.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        errors.push({
            message: "Unmatched parentheses detected",
            suggestion: "Ensure all opening parentheses '(' have matching closing parentheses ')'.",
            severity: "error"
        });
    }

    // Check for invalid GROUP BY usage
    if (/GROUP BY/i.test(query) && !/SELECT.*GROUP BY/i.test(query)) {
        errors.push({
            message: "Incorrect GROUP BY usage",
            suggestion: "Ensure GROUP BY is used correctly after SELECT.",
            severity: "error"
        });
    }

    // Check for incorrect JOIN usage
    if (/JOIN/i.test(query) && !/FROM\s+\w+\s+JOIN\s+\w+/i.test(query)) {
        errors.push({
            message: "Incorrect JOIN syntax",
            suggestion: "Ensure JOIN is used properly, e.g., SELECT * FROM users JOIN orders ON users.id = orders.user_id;",
            severity: "error"
        });
    }

    displayErrors(errors);
}

// Function to display errors
function displayErrors(errors) {
    errorList.innerHTML = '';
    if (errors.length === 0) {
        errorList.innerHTML = `<div class="list-group-item list-group-item-success"><i class="bi bi-check-circle-fill me-2"></i>No issues found!</div>`;
    } else {
        errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.classList.add('list-group-item', 'error-item', 'text-danger');
            errorItem.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${error.message} - ${error.suggestion}`;
            errorList.appendChild(errorItem);
        });
    }
}

// Function to check for misspelled SQL keywords
function spellCheckSQL(sql) {
    const misspelledWords = [];
    const words = sql.match(/\b\w+\b/g);
    if (words) {
        words.forEach(word => {
            const upperWord = word.toUpperCase();
            if (sqlKeywords.has(upperWord)) {
                misspelledWords.push({
                    word: upperWord,
                    correct: sqlKeywords.get(upperWord)
                });
            }
        });
    }
    return misspelledWords;
}

// Event listeners
editor.on('change', () => {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkQuery, 500);
});

formatBtn.addEventListener('click', () => {
    editor.setValue(formatSQL(editor.getValue()));
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
        editor.setValue('');
    }
});
