-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 30, 2026 at 02:46 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `worker_allocation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `allocations`
--

DROP TABLE IF EXISTS `allocations`;
CREATE TABLE IF NOT EXISTS `allocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `worker_id` int NOT NULL,
  `project_id` int NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `allocation_date` date NOT NULL,
  `status` enum('assigned','completed','pending') NOT NULL DEFAULT 'assigned',
  `time_stamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `assigned_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_worker_day_date` (`worker_id`,`day_of_week`,`allocation_date`),
  KEY `fk_allocations_project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `allocations`
--

INSERT INTO `allocations` (`id`, `worker_id`, `project_id`, `day_of_week`, `allocation_date`, `status`, `time_stamp`) VALUES
(236, 10, 2, 'Wednesday', '2026-07-29', 'assigned', '2026-07-29 04:20:05'),
(237, 11, 2, 'Wednesday', '2026-07-29', 'assigned', '2026-07-29 04:19:43'),
(240, 13, 2, 'Thursday', '2026-07-30', 'assigned', '2026-07-29 04:21:28'),
(257, 1, 5, 'Monday', '2026-07-27', 'assigned', '2026-07-30 02:42:44'),
(258, 2, 5, 'Monday', '2026-07-27', 'assigned', '2026-07-30 02:42:45');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_number` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `site_number`, `name`, `description`, `created_at`, `status`) VALUES
(1, 1, 'COMMERCIAL TOWER', 'High-rise commercial tower foundation & framework', '2026-07-27 07:45:29', 'Inactive'),
(2, 2, 'RESIDENTIAL COMPLEX', 'Multi-family residential complex buildout', '2026-07-27 07:45:29', 'Inactive'),
(3, 3, 'BRIDGE REHAB', 'Structural repair, steel welding & deck replacement', '2026-07-27 07:45:29', 'Inactive'),
(5, 5, 'Sto Rosario', '', '2026-07-27 08:00:13', 'Active'),
(6, 6, 'PANICSICAN', '', '2026-07-28 00:23:12', 'Active'),
(8, 7, 'CAPITOL', '', '2026-07-28 02:49:00', 'Active'),
(9, 8, 'LUNA', '', '2026-07-28 02:51:55', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;
CREATE TABLE IF NOT EXISTS `workers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `trade` varchar(100) NOT NULL,
  `skill_level` varchar(50) DEFAULT 'Experienced',
  `status` varchar(50) DEFAULT 'Available',
  `experience` varchar(50) DEFAULT '5 yrs Exp.',
  `profile_photo_url` text,
  `address` varchar(500) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`id`, `name`, `trade`, `skill_level`, `status`, `experience`, `profile_photo_url`, `address`, `phone_number`, `created_at`) VALUES
(1, 'A. Reyes', 'Foreman', 'Senior', 'Assigned', '10 yrs Exp.', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80', 'Brgy. San Jose, Lingayen, Pangasinan', '+63 917 123 4567', '2026-07-27 07:45:29'),
(2, 'B. Santos', 'Carpenter', 'Master', 'Assigned', '8 yrs Exp.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'Brgy. Poblacion, Dagupan City, Pangasinan', '+63 918 234 5678', '2026-07-27 07:45:29'),
(3, 'C. Lim', 'Electrician', 'Licensed', 'Available', '6 yrs Exp.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 'Brgy. Bonuan, Dagupan City, Pangasinan', '+63 919 345 6789', '2026-07-27 07:45:29'),
(4, 'S. Ramos', 'Carpenter', 'Journeyman', 'Available', '5 yrs Exp.', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80', 'Brgy. Maniboc, Lingayen, Pangasinan', '+63 920 456 7890', '2026-07-27 07:45:29'),
(5, 'M. Garcia', 'Electrician', 'Senior', 'Available', '7 yrs Exp.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', 'Brgy. Pangasinan, San Carlos City, Pangasinan', '+63 921 567 8901', '2026-07-27 07:45:29'),
(6, 'E. Perez', 'Electrician', 'Licensed', 'Available', '4 yrs Exp.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80', 'Brgy. Urdaneta, Urdaneta City, Pangasinan', '+63 922 678 9012', '2026-07-27 07:45:29'),
(7, 'E. Flores', 'Laborer', 'Apprentice', 'Available', '2 yrs Exp.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', 'Brgy. Malasiqui, Malasiqui, Pangasinan', '+63 923 789 0123', '2026-07-27 07:45:29'),
(8, 'J. Tan', 'Electrician', 'Senior', 'Available', '5 yrs Exp.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'Brgy. Binmaley, Binmaley, Pangasinan', '+63 925 890 1234', '2026-07-27 07:45:29'),
(9, 'R. Santos', 'Carpenter', 'Master', 'Available', '9 yrs Exp.', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80', 'Brgy. Calasiao, Calasiao, Pangasinan', '+63 926 901 2345', '2026-07-27 07:45:29'),
(10, 'F. Perez', 'Carpenter', 'Journeyman', 'Assigned', '6 yrs Exp.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80', 'Brgy. Mangaldan, Mangaldan, Pangasinan', '+63 927 012 3456', '2026-07-27 07:45:29'),
(11, 'N. Flores', 'Laborer', 'Apprentice', 'Assigned', '3 yrs Exp.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 'Brgy. San Fabian, San Fabian, Pangasinan', '+63 928 123 4567', '2026-07-27 07:45:29'),
(12, 'D. Cruz', 'Electrician', 'Licensed', 'Available', '7 yrs Exp.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', 'Brgy. Rosales, Rosales, Pangasinan', '+63 929 234 5678', '2026-07-27 07:45:29'),
(13, 'Rommel Mallare', 'Foreman', 'Master', 'Assigned', '15 yrs Exp.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 'Brgy. Asingan, Asingan, Pangasinan', '+63 930 345 6789', '2026-07-27 08:14:42'),
(14, 'Rommel', 'Electrician', 'Licensed', 'Available', '5 yrs Exp.', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80', 'Brgy. Bayambang, Bayambang, Pangasinan', '+63 931 456 7890', '2026-07-27 08:21:48');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `allocations`
--
ALTER TABLE `allocations`
  ADD CONSTRAINT `fk_allocations_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_allocations_worker` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
