-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 01, 2026 at 06:18 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middle_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `daily_rate` decimal(10,2) DEFAULT '0.00',
  `has_deductions` tinyint(1) DEFAULT '0',
  `profile_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `default_branch_id` int DEFAULT NULL,
  `performance_allowance` decimal(10,2) DEFAULT '0.00',
  `branch_id` int DEFAULT NULL,
  `branch_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `face_consent_given` tinyint(1) DEFAULT '0',
  `face_data_version` varchar(10) COLLATE utf8mb4_unicode_ci,
  `face_capture_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skill_level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Medium',
  `experience` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '0 yrs Exp.',
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_employee_branch` (`branch_name`),
  KEY `idx_employee_branch_code` (`branch_code`)
) ENGINE=MyISAM AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_code`, `first_name`, `middle_name`, `last_name`, `email`, `department`, `position`, `branch_name`, `status`, `daily_rate`, `has_deductions`, `profile_image`, `created_at`, `updated_at`, `default_branch_id`, `performance_allowance`, `branch_id`, `branch_code`, `face_consent_given`, `face_data_version`, `face_capture_image`, `skill_level`, `experience`, `address`, `phone_number`) VALUES
(5, 'W0001', 'Testtt', 'sdfgdsg', 'sfdg', 'sfdg@gmail.com', NULL, 'Worker', 'Capitol', 'Active', 100.00, 1, 'uploads/employees/69e18cd6c872f_46.png', '2026-04-14 05:14:15', '2026-07-31 19:12:19', NULL, 0.00, 6, 'F', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(7, 'SA001', 'Super', 'Torres', 'Admin', 'admin@jajrconstruction.com', NULL, 'Admin', 'Capitol', 'Active', 600.00, 0, 'uploads/profile_images/profile_6_1771480314.png', '2026-04-16 08:33:09', '2026-07-31 19:14:57', NULL, 0.00, 6, 'F', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(8, 'E0001', 'AARIZ', NULL, 'MARLOU', 'aariz.marlou@example.com', NULL, 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d6006a66bfe6.32302616.png', '2026-04-16 08:33:09', '2026-08-01 06:07:36', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '5 yrs Exp.', 'Mangaan, Santol, La Union', '09668160595'),
(9, 'E0002', 'CESAR', NULL, 'ABUBO', 'cesar.abubo@example.com', NULL, 'Worker', 'Testing Branch', 'Active', 550.00, 1, 'uploads/employees/69e1f5570e031_compressed_profile.jpg', '2026-04-16 08:33:09', '2026-05-11 21:49:43', NULL, 150.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(10, 'E0003', 'MARLON', '', 'AGUILAR', 'marlon.aguilar@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d600211a0589.35341824.png', '2026-04-16 08:33:09', '2026-08-01 06:06:24', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '5 yrs Exp.', NULL, NULL),
(11, 'E0004', 'NOEL', NULL, 'ARIZ', 'noel.ariz@example.com', 'Operations', 'Worker', 'Sto. Rosario', 'Active', 550.00, 0, NULL, '2026-04-16 08:33:09', '2026-05-18 00:21:21', NULL, 0.00, 1, 'A', 0, 'v1', '/assets/face-captures/employees/11_face_1779092480121.jpg', 'Medium', '0 yrs Exp.', NULL, NULL),
(12, 'E0005', 'DANIEL', '', 'BACHILLER', 'daniel.bachiller@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d6002e97f1d3.80387073.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(13, 'E0006', 'ALFREDO', '', 'BAGUIO', 'alfredo.baguio@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d5ff418361b7.89098507.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(14, 'E0007', 'ROLLY', '', 'BALTAZAR', 'rolly.baltazar@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5ff547f48e9.55971784.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(15, 'E0008', 'DONG', NULL, 'BAUTISTA', 'dong.bautista@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 20, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(16, 'E0009', 'JANLY', '', 'BELINO', 'janly.belino@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 650.00, 0, 'profile_69d5f8bd3ff0e7.72784110.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(17, 'E0010', 'MENUEL', '', 'BENITEZ', 'menuel.benitez@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d5f8d8982db4.66850139.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(18, 'E0011', 'GELMAR', '', 'BARNACHEA', 'gelmar.bernachea@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5ff3620afe4.25764722.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(19, 'E0012', 'JOMAR', NULL, 'CABANBAN', 'jomar.cabanban@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(20, 'E0013', 'MARIO', '', 'CABANBAN', 'mario.cabanban@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d9bdfcd6a4e1.58343645.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(21, 'E0014', 'KELVIN', NULL, 'CALDERON', 'kelvin.calderon@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(22, 'E0015', 'FLORANTE', NULL, 'CALUZA', 'florante.caluza@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(23, 'E0016', 'MELVIN', NULL, 'CAMPOS', 'melvin.campos@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(24, 'E0017', 'JERWIN', '', 'CAMPOS', 'jerwin.campos@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d5ff06eb31e2.16953567.png', '2026-04-16 08:33:09', '2026-04-23 03:45:43', NULL, 150.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(25, 'E0018', 'BENJIE', '', 'CARAS', 'benjie.caras@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d5ffdbd4db63.91949381.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(26, 'E0019', 'JORELLE BONJO', '', 'DACUMOS', 'bonjo.dacumos@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d60206afa450.64233705.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(27, 'E0020', 'RYAN', '', 'DEOCARIS', 'ryan.deocaris@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d6009b3d7d21.77206328.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(28, 'E0021', 'BEN', '', 'ESTEPA', 'ben.estepa@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d6007aeb1ce2.19714221.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 600.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(29, 'E0022', 'MAR DAVE', '', 'FLORES', 'mardave.flores@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d5ffa98b1854.65713856.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(30, 'E0023', 'ALBERT', '', 'FONTANILLA', 'albert.fontanilla@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d600ff0c9b92.81545089.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(31, 'E0024', 'JOHN WILSON', NULL, 'FONTANILLA', 'johnwilson.fontanilla@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 20, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(32, 'E0025', 'LEO', '', 'GURTIZA', 'leo.gurtiza@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d5fec772d144.20772071.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(33, 'E0026', 'JOSE', '', 'IGLECIAS', 'jose.iglecias@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d9afab0cf298.43125381.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 31, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(34, 'E0027', 'JEFFREY', '', 'JIMENEZ', 'jeffrey.jimenez@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d6008a7d4189.24345782.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(35, 'E0028', 'WILSON', '', 'LICTAOA', 'wilson.lictaoa@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(36, 'E0029', 'LORETO', '', 'MABALO', 'loreto.mabalo@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d9bddccd1619.96311862.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(37, 'E0030', 'ROMEL', '', 'MALLARE', 'romel.mallare@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 800.00, 0, 'profile_69d5fea1eb47d3.35526436.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 31, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(38, 'E0031', 'SAMUEL SR.', '', 'MARQUEZ', 'samuel.marquez@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5fe62cbdd09.62445973.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(39, 'E0032', 'ROLLY', NULL, 'MARZAN', 'rolly.marzan@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(40, 'E0033', 'RONALD', '', 'MARZAN', 'ronald.marzan@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d9bdf04c57f8.40601532.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 1000.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(41, 'E0034', 'WILSON', '', 'MARZAN', 'wilson.marzan@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d6004781b584.57723505.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(42, 'E0035', 'MARVIN', NULL, 'MIRANDA', 'marvin.miranda@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(43, 'E0036', 'JOE', '', 'MONTERDE', 'joe.monterde@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d5ff67b7ece6.83173563.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(44, 'E0038', 'ARNOLD', '', 'NERIDO', 'arnold.nerido@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 31, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(45, 'E0040', 'DANNY', '', 'PADILLA', 'danny.padilla@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d600ac33ec53.26400528.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(46, 'E0041', 'EDGAR', NULL, 'PANEDA', 'edgar.paneda@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 26, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(47, 'E0042', 'JEREMY', '', 'PIMENTEL', 'jeremy.pimentel@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d600d6b1d057.48967611.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(48, 'E0043', 'MIGUEL', NULL, 'PREPOSI', 'miguel.preposi@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(49, 'E0044', 'JUN', NULL, 'ROAQUIN', 'jun.roaquin@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 26, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(50, 'E0045', 'RICKMAR', '', 'SANTOS', 'rickmar.santos@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d600eed64931.69263448.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 28, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(51, 'E0046', 'RIO', '', 'SILOY', 'rio.siloy@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 750.00, 0, 'profile_69d5fe758e89a2.19541693.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 150.00, 32, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(52, 'E0047', 'NORMAN', '', 'TARAPE', 'norman.tarape@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5fe90ac00d1.71248253.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(53, 'E0048', 'HILMAR', '', 'TATUNAY', 'hilmar.tatunay@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5ff866f3104.37734210.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(54, 'E0049', 'KENNETH JOHN', '', 'UGAS', 'kennethjohn.ugas@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d5ff943a6d70.65129657.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 50.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(55, 'E0050', 'CLYDE JUSTINE', NULL, 'VASADRE', 'clydejustine.vasadre@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 28, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(56, 'E0053', 'JOYLENE F.', NULL, 'BALANON', 'joylene.balanon@example.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(57, 'ENG-2026-0002', 'John Kennedy', '', 'Lucas', 'lucas@gmail.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(58, 'ENG-2026-0003', 'Julius John', '', 'Echague', 'echague@gmail.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(59, 'PRO-2026-0001', 'Junell', '', 'Tadina', 'tadina@gmail.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(60, 'ENG-2026-0006', 'Winnielyn Kaye', '', 'Olarte', 'olarte@gmail.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(61, 'E0057', 'RONALYN', NULL, 'MALLARE', 'ronalyn.mallare@example.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(62, 'E0058', 'MICHELLE F.', NULL, 'NORIAL', 'michelle.norial@example.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(63, 'ADMIN-2026-0001', 'Elaine', 'Torres', 'Aguilar', 'aguilar@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, 'profile_6996a4f55d7335.10207456.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(64, 'SA-2026-002', 'Jason', 'Larkin', 'Wong', 'wong@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(65, 'SA-2026-003', 'Lee Aldrich', '', 'Rimando', 'rimando@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(66, 'SA-2026-004', 'Marc Justin', '', 'Arzadon', 'arzadon@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(67, 'W0050', 'JOSHUA', NULL, 'ARQUITOLA', 'joshua.arquitola@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(68, 'W0051', 'VERGEL', '', 'DACUMOS', 'vergel.dacumos@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(69, 'W0052', 'REAL RAIN', NULL, 'IVERSON', 'realrain.iverson@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(70, 'W0053', 'VOHANN', '', 'MIRANDA', 'vohann.miranda@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 22, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(71, 'W0054', 'SONNY', NULL, 'OCCIANO', 'sonny.occiano@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 1400.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(72, 'W0055', 'RANDY', '', 'ATON', 'randy.aton@example.com', 'Operations', 'Worker', 'Sto. Rosario', 'Active', 600.00, 0, 'profile_69d600c4792567.58068989.png', '2026-04-16 08:33:09', '2026-05-17 22:38:04', NULL, 50.00, 1, 'A', 0, 'v1', '/assets/face-captures/employees/72_face_1779086283122.jpg', 'Medium', '0 yrs Exp.', NULL, NULL),
(73, 'W0056', 'JHUNEL', '', 'CANCHO', 'jhunel.cancho@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5fe54d05ff6.44033214.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 32, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(74, 'W0057', 'HECTOR', NULL, 'PADICLAS', 'hector.padiclas@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(75, 'W0058', 'MARIANO', NULL, 'NERIDO', 'mariano.nerido@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(76, 'W0059', 'JAYSON KENNETH', NULL, 'PADILLA', 'jaysonkenneth.padilla@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(77, 'W0060', 'JEFFREY', '', 'ZAMORA', 'jeffrey.zamora@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, 'profile_69d601095e8562.71487068.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 100.00, 31, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(78, 'W0061', 'FRANKIE', NULL, 'PADILLA', 'frankie.padilla@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(79, 'W0062', 'ROMEO', '', 'GURION', 'romeo.gurion@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d5ff1d4c6693.09123495.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(80, 'ADMIN-2026-0003', 'Charisse', 'Abaya', 'Laureaga', 'charisse@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(81, 'ADMIN-2026-0004', 'Marjorie', '', 'Garcia', 'garcia@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 5, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(82, 'ENG-2026-0007', 'Earl Cleint', 'Ordono', 'Nisperos', 'nisperos@gmail.com', 'Engineering', 'Engineer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(83, 'IT-2026-01', 'Daniel ', 'Obaldo', 'Rillera', 'danrillera.va@gmail.com', 'IT', 'Developer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(84, 'IT-2026-02', 'Prince Christiane', 'Borja', 'Tolentino', 'tolentinochristian89@gmail.com', 'IT', 'Developer', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(85, 'W0063', 'Gilbert', '', 'Avecilla', 'avecilla@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(86, 'W0064', 'Joseph', '', 'Espanto', 'espanto@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d9af93b4b563.99389483.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(87, 'W0065', 'Ronel', '', 'Noces', 'noces@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, 'profile_69d5fe420625c5.31868763.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(88, 'W0066', 'Fernando', '', 'Rivera', 'rivera@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d600e353fb09.09593138.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(89, 'W0067', 'Darwin', '', 'Gurion', 'gurion1@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d5fed995d947.19342413.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(90, 'W0068', 'Rey', '', 'Gurion', 'gurion2@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d5feeb0d97b1.11056357.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(91, 'W0069', 'Santi', '', 'Abubo', 'abubo1@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69d5ffe6e6d766.98386818.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(92, 'ADMIN-2026-0005', 'Lyra', '', 'Javonillo', 'javonillo@gmail.com', 'Administration', 'Admin', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 33, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(93, 'W0070', 'Sonny', '', 'Pascua', 'sonny@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(94, 'W0071', 'Edwin', '', 'Laforteza', 'edwin@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(95, 'W0072', 'Semy', '', 'Abat', 'abat@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, 'profile_69c72508562873.21033310.png', '2026-04-16 08:33:09', '2026-04-23 03:47:08', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(96, 'W0073', 'Reynaldo', '', 'Gurion', 'gurion@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(97, 'W0074', 'Larry', '', 'Gurion', 'larry@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 700.00, 0, 'profile_69d9aff8f24610.75781313.png', '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(98, 'W0075', 'Kyle', '', 'Arrieta', 'kyle@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 550.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(99, 'W0076', 'Rolan', '', 'Estrada', 'estrada@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 31, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(100, 'W0077', 'Ronald', '', 'Estrada', 'ronald@gmail.com', 'Operations', 'Worker', 'Sto. Rosario', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-07-31 21:44:38', NULL, 0.00, 1, 'A', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(101, 'W0078', 'Arlene', '', 'Catbagan', 'cat@gmail.com', 'Operations', 'Worker', 'Sto. Rosario', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-07-31 21:44:38', NULL, 0.00, 1, 'A', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(102, 'W0079', 'Test', '', 'Worker', 'testworker@gmail.com', 'Operations', 'Worker', 'Sto. Rosario', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-07-31 21:44:38', NULL, 90.00, 1, 'A', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(103, 'W0080', 'Wilben', '', 'Gurion', 'gurion5@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(104, 'W0081', 'Rodel', '', 'Ochoco', 'ochoco@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 10, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(105, 'W0082', 'Justine', '', 'Iglesias', 'Iglesias2@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(106, 'W0083', 'Jhonrey', '', 'Danao', 'danao@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(107, 'W0084', 'Marvin', '', 'Mirandan', 'miranda@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 24, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(108, 'W0085', 'SONNY', '', 'OCCIANO', 'occiano@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 1400.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 24, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(109, 'W0086', 'GIN TYRONE', '', 'AQUINO', 'aquino@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(110, 'W0087', 'EFREN JAY', '', 'MORALES', 'morales@gmail.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-04-16 08:33:09', '2026-04-22 01:15:50', NULL, 0.00, 21, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(111, 'W0088', 'tester', 'Tiamin', 'Employe', 'tester@gmail.com', NULL, 'Worker', 'Testing Branch', 'Active', 0.00, 0, NULL, '2026-04-17 07:49:05', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(112, 'W0089', 'sdfgdfg', 'sdfgdf', 'sdfgsdfg', 'sdfgsd@gmail.com', NULL, 'Worker', 'Testing Branch', 'Active', 434.00, 0, '/assets/profile-images/employees/112_1777364952965.jpg', '2026-04-17 08:55:09', '2026-04-22 01:15:50', NULL, 43543.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(113, 'E0037', 'ALDRED', NULL, 'NATARTE', 'aldred.natarte@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 600.00, 0, NULL, '2026-01-22 07:58:04', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(114, 'E0039', 'RONEL', NULL, 'NOSES', 'ronel.noses@example.com', 'Operations', 'Worker', 'Testing Branch', 'Active', 500.00, 0, NULL, '2026-01-22 07:58:04', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(115, 'ADMIN-2026-0007', 'LYRA', NULL, 'JAVONILLO', 'javonillo1@gmail.com', 'Administration', 'Admin', 'Main Office', 'Active', 500.00, 0, NULL, '2026-01-22 07:58:04', '2026-04-22 01:15:50', NULL, 0.00, NULL, 'E', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(116, 'E0051', 'sdgdsfg', NULL, 'sdfgsdfg', 'sertgr@gmail.com', NULL, 'Worker', NULL, 'Active', 0.00, 1, '/assets/profile-images/employees/116_1777364923553.jpg', '2026-04-27 16:31:31', '2026-04-27 16:31:31', NULL, 0.00, NULL, 'H', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(117, 'ENG-2026-0008', 'sfdsdf', NULL, 'asdfsdf', 'adfasdf', NULL, 'Engineer', NULL, 'Active', 0.00, 1, '/assets/profile-images/employees/117_1778133702393.png', '2026-04-27 16:31:47', '2026-04-27 16:31:47', NULL, 0.00, NULL, 'A', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(118, 'DEV-2026-0001', 'hiopo', 'hiop', 'hiopiop', 'danielrillera2@gmail.com', NULL, 'Developer', 'Sto. Rosario', 'Active', 0.00, 1, '/assets/profile-images/employees/118_1777365385273.jpg', '2026-04-27 23:24:10', '2026-05-17 21:26:25', NULL, 0.00, 1, 'A', 0, 'v1', NULL, 'Medium', '0 yrs Exp.', NULL, NULL),
(119, 'E0052', 'Johnny ', NULL, 'Sins', 'sins@gmail.com', NULL, 'Worker', 'Sto. Rosario', 'Active', 0.00, 1, '/assets/profile-images/employees/119_1785547322180.png', '2026-07-31 17:22:02', '2026-07-31 21:33:07', NULL, 0.00, 1, 'A', 0, NULL, NULL, 'Medium', '0 yrs Exp.', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
