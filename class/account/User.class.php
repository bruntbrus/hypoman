<?php
namespace hypoman\account;
use hypoman\database\Database;

/**
 * User class.
 * 
 * @author Tomas
 */
class User {

  /**
   * @var User
   */
  protected static $activeUser = null;

  /**
   * @var int
   */
  public $id;

  /**
   * @var string
   */
  public $name;

  /**
   * @var string
   */
  public $password;

  /**
   * @var string
   */
  public $email;

  /**
   * Init.
   */
  public static function init() {}

  /**
   * Get active user.
   * 
   * @return User
   */
  public static function getActiveUser() {
    if (!self::$activeUser) {
      self::$activeUser = @$_SESSION['user'];
    }
    return self::$activeUser;
  }

  /**
   * Get user by id.
   * 
   * @param int $id
   * @return User
   */
  public static function getUserById($id) {
    $id     = (int) $id;
    $sql    = "SELECT `username`,`password`,`email` FROM `account` WHERE `id`=$id";
    $pdo    = Database::getConnection();
    $pst    = $pdo->query($sql);
    $record = $pst->fetch(\PDO::FETCH_ASSOC);
    if (empty($record)) {
      return null;
    }
    extract($record);
    return new User($id, $username, $password, $email);
  }

  /**
   * Get user by name.
   * 
   * @param string $name
   * @return User
   */
  public static function getUserByName($name) {
    $sql = "SELECT `id`,`password`,`email` FROM `account` WHERE `username`=?";
    $pdo = Database::getConnection();
    $pst = $pdo->prepare($sql);
    $pst->execute(array($name));
    $record = $pst->fetch(\PDO::FETCH_ASSOC);
    if (empty($record)) {
      return null;
    }
    extract($record);
    return new self($id, $name, $password, $email);
  }

  /**
   * Login.
   * 
   * @param User $user
   * @param string $password
   * @return bool
   */
  public static function login($user, $password) {
    if ($user->password == sha1($password)) {
      self::$activeUser = $user;
      $_SESSION['user'] = $user;
      return true;
    }
    return false;
  }

  /**
   * Logout.
   */
  public static function logout() {
    self::$activeUser = null;
    unset($_SESSION['user']);
  }

  /**
   * Construct.
   * 
   * @param int $id
   * @param string $name
   * @param string $password
   * @param string $email
   */
  public function __construct($id, $name, $password, $email = '') {
    $this->id       = $id;
    $this->name     = $name;
    $this->password = $password;
    $this->email    = $email;
  }

  /**
   * Get record.
   * 
   * @return array
   */
  public function getRecord() {
    return array(
      'username' => $this->name,
      'password' => $this->password,
      'email'    => $this->email
    );
  }

  /**
   * Persist.
   */
  public function persist() {
    $record = $this->getRecord();
    $fields = array_keys($record);
    $values = array_values($record);
    if ($this->id === null) {
      $sql = Database::prepareInsertSQL('account', $fields);
      $pdo = Database::getConnection();
      $pdo->prepare($sql);
      $pst->execute($values);
      $this->id = $pdo->lastInsertId();
    } else {
      $setSQL = Database::prepareSetSQL($fields);
      $id     = (int) $this->id;
      $sql    = "UPDATE `account` SET $setSQL WHERE `id`=$id";
      $pdo    = Database::getConnection();
      $pst    = $pdo->prepare($sql);
      $pst->execute($values);
    }
  }
}
