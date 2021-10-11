<?php
namespace hypoman\database;

/**
 * Database class.
 * 
 * @author Tomas
 */
final class Database {

  const DSN = 'mysql:host=localhost';

  /**
   * @var array
   */
  private static $connections = array();

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Connect.
   * 
   * @param string $dbname
   * @param string $username
   * @param string $password
   * @return \PDO
   */
  public static function connect($dbname, $username, $password) {
    $dsn = self::DSN.';dbname='.$dbname;
    $pdo = new \PDO($dsn, $username, $password, array(
      \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ));
    $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    self::$connections[$username] = $pdo;
    return $pdo;
  }

  /**
   * Get connection.
   * 
   * @param string $name
   * @return \PDO
   */
  public static function getConnection($name = 'user') {
    $connection = @self::$connections[$name];
    if (!isset($connection)) {
      if ($name == 'user') {
        $connection = self::connect('hypoman', 'user', 'pass');
      } else {
        $connection = null;
      }
    }
    return $connection;
  }

  /**
   * Field SQL.
   * 
   * @param array $fields
   * @return string
   */
  public static function fieldSQL(array $fields = null) {
    return (empty($fields) ? '*' : '`'.implode('`,`', $fields).'`');
  }

  /**
   * Set SQL.
   * 
   * @param array $record
   * @return string
   */
  public static function setSQL(array $record) {
    $sql = array();
    foreach ($record as $field => $value) {
      if (is_string($value)) {
        $value = "'$value'";
      }
      $sql[] = "`$field`=$value";
    }
    return implode(',', $sql);
  }

  /**
   * Prepare set SQL.
   * 
   * @param array $fields
   * @return string
   */
  public static function prepareSetSQL(array $fields) {
    return '`'.implode('`=?,`', $fields).'`=?';
  }

  /**
   * Value SQL.
   * 
   * @param array $values
   * @return string
   */
  public static function valueSQL(array $values) {
    $sql = array();
    foreach ($values as $value) {
      if (is_string($value)) {
        $value = "'$value'";
      }
      $sql[] = $value;
    }
    return implode(',', $sql);
  }

  /**
   * Prepare value SQL.
   * 
   * @param array $values
   * @return string
   */
  public static function prepareValueSQL(array $values) {
    return '?'.str_repeat(',?', count($values) - 1);
  }

  /**
   * Prepare insert SQL.
   * 
   * @param string $table
   * @param array $fields
   * @return string
   */
  public static function prepareInsertSQL($table, array $fields) {
    $fieldSQL = self::fieldSQL($fields);
    $valueSQL = self::prepareValueSQL($fields);
    return "INSERT INTO `$table` ($fieldSQL) VALUES ($valueSQL)";
  }

  /**
   * Construct.
   */
  private function __construct() {}
}
