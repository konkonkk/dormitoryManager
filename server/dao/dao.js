var sql = {
    vaildUser: 'SELECT * FROM tb_user WHERE uid=? AND pwd=?',
    // queryStdAll: 'SELECT * FROM tb_students ',
    queryStdAll: 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_students ORDER BY No limit ?,?',
    queryStdPart: 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_students',
    getTotal: 'SELECT FOUND_ROWS()',
    editStd: 'UPDATE tb_students SET id=?, name=?, roomId=?, class=?, tel=? WHERE id=?',
    delStd: 'DELETE FROM tb_students WHERE id=?',
    addStd: 'INSERT INTO tb_students SET ?'
}

module.exports = sql