-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 31, 2023 at 05:52 AM
-- Server version: 8.0.27
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nyawer_onlen`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id_admin` varchar(20) NOT NULL,
  `username_admin` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nama_admin` varchar(100) NOT NULL,
  `email_admin` varchar(100) NOT NULL,
  `password_admin` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status_admin` enum('Aktif','Tidak aktif') NOT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `username_admin`, `nama_admin`, `email_admin`, `password_admin`, `createdAt`, `updatedAt`, `status_admin`) VALUES
('admin', 'admin', 'Lukman Hakim', 'admin@email.com', 'e10adc3949ba59abbe56e057f20f883e', '2023-01-30 10:46:16', '2023-01-30 10:46:16', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `dompets`
--

DROP TABLE IF EXISTS `dompets`;
CREATE TABLE IF NOT EXISTS `dompets` (
  `id_dompet` varchar(20) NOT NULL,
  `id_user` varchar(10) NOT NULL,
  `reff_transaksi` varchar(10) NOT NULL,
  `nama_transaksi` varchar(100) NOT NULL,
  `penyesuaian` enum('Credit','Debit') NOT NULL,
  `nominal` int NOT NULL,
  `waktu_transaksi_dompet` datetime DEFAULT NULL,
  `createdat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_transaksi_dompet` enum('Pending','Sukses','Gagal') NOT NULL,
  PRIMARY KEY (`id_dompet`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dompets`
--

INSERT INTO `dompets` (`id_dompet`, `id_user`, `reff_transaksi`, `nama_transaksi`, `penyesuaian`, `nominal`, `waktu_transaksi_dompet`, `createdat`, `updatedAt`, `status_transaksi_dompet`) VALUES
('Rz4YHX3d', 'kai29391', 'mLQYA2RvhO', 'Penambahan saldo dari test', 'Credit', 96000, '2023-01-31 05:31:34', '2023-01-31 05:31:34', '2023-01-31 05:31:34', 'Sukses'),
('ZnQd5DpH', 'kai29391', 'RF-oElgPfZ', 'Pengembalian saldo dari Penarikan WD-bNzOyji', 'Credit', 10000, '2023-01-31 04:49:35', '2023-01-31 04:49:34', '2023-01-31 04:49:34', 'Sukses'),
('EYcyOXbY', 'kai29391', 'WD-4omgrXR', 'Penarikan saldo', 'Debit', -20000, '2023-01-31 04:28:14', '2023-01-31 04:28:13', '2023-01-31 04:28:13', 'Pending'),
('3hSjMpIu', 'kai29391', 'WD-bNzOyji', 'Penarikan saldo', 'Debit', -10000, '2023-01-31 04:26:47', '2023-01-31 04:26:46', '2023-01-31 04:49:34', 'Gagal'),
('eygojCqA', 'kai29391', '2vzrO457d9', 'Penambahan saldo dari Cindy Andita Putri', 'Credit', 6000, '2023-01-31 04:11:45', '2023-01-31 04:11:45', '2023-01-31 04:11:45', 'Sukses'),
('LnuZv9SZ', 'kai29391', '9hWRqhSKl0', 'Penambahan saldo dari Jikky', 'Credit', 196000, '2023-01-31 03:29:12', '2023-01-31 03:29:12', '2023-01-31 03:29:12', 'Sukses'),
('BAXXE3Bl', '9dfjk1', 'WD-ZmtOuf2', 'Penarikan saldo', 'Debit', -90000, '2023-01-31 03:27:42', '2023-01-31 03:27:42', '2023-01-31 03:34:35', 'Sukses'),
('oGhOTc7k', '9dfjk1', 'pt7KY82CCB', 'Penambahan saldo dari Lukman Hakim', 'Credit', 996000, '2023-01-31 03:27:18', '2023-01-31 03:27:17', '2023-01-31 03:27:17', 'Sukses'),
('0UVVe41Z', 'kai29391', 'NKtyYYOsRq', 'Penambahan saldo dari Cindy Andita Putri', 'Credit', 6000, '2023-01-30 09:52:04', '2023-01-30 09:52:04', '2023-01-30 09:52:04', 'Sukses'),
('sXTCfj66', '9dfjk1', 'EgJBZ7olVN', 'Penambahan saldo dari Cindy Andita Putri', 'Credit', 6000, '2023-01-31 03:21:46', '2023-01-31 03:21:46', '2023-01-31 03:21:46', 'Sukses');

-- --------------------------------------------------------

--
-- Table structure for table `metode_pembayarans`
--

DROP TABLE IF EXISTS `metode_pembayarans`;
CREATE TABLE IF NOT EXISTS `metode_pembayarans` (
  `id_mp` varchar(10) NOT NULL,
  `nama_mp` varchar(50) NOT NULL,
  `biaya_mp` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `penyesuaian_biaya` enum('Persentase','Fixed','Persentase + Fixed','') NOT NULL,
  `publish` enum('Yes','No') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status_mp` enum('Aktif','Tidak aktif','','') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_mp`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `metode_pembayarans`
--

INSERT INTO `metode_pembayarans` (`id_mp`, `nama_mp`, `biaya_mp`, `penyesuaian_biaya`, `publish`, `createdAt`, `updatedAt`, `status_mp`) VALUES
('SP', 'QRIS - ShopeePay', '0.04', 'Persentase', 'Yes', '2023-01-29 00:55:54', '2023-01-31 03:30:55', 'Tidak aktif'),
('OV', 'OVO', '0.05', 'Persentase', 'Yes', '2023-01-29 00:56:03', '2023-01-31 03:31:05', 'Tidak aktif'),
('CC', 'Kartu Kredit', '0.05 + 1200', 'Persentase + Fixed', 'Yes', '2023-01-29 00:56:10', '2023-01-29 00:56:12', 'Tidak aktif'),
('BR', 'BRI Virtual Account', '4000', 'Fixed', 'Yes', '2023-01-29 00:56:03', '2023-01-30 09:28:23', 'Aktif'),
('BT', 'Permata Bank Virtual Account', '4000', 'Fixed', 'Yes', '2023-01-29 00:56:03', '2023-01-29 00:56:06', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_nyawers`
--

DROP TABLE IF EXISTS `transaksi_nyawers`;
CREATE TABLE IF NOT EXISTS `transaksi_nyawers` (
  `id_transaksi` varchar(20) NOT NULL,
  `reff_pg` varchar(100) NOT NULL,
  `nama_pengirim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id_pengirim` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_pengirim` varchar(100) NOT NULL,
  `user_id_penerima` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nominal` int NOT NULL,
  `pesan_pengirim` varchar(255) NOT NULL,
  `metode_pembayaran_id` varchar(10) NOT NULL,
  `biaya_admin` int NOT NULL,
  `total_terima` int NOT NULL,
  `link_bayar` varchar(255) NOT NULL,
  `waktu_transaksi` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_transaksi` enum('Pending - Menunggu Pembayaran','Pending - Menunggu Konfirmasi Admin','Sukses','Gagal - Dibatalkan System','Gagal - Dibatalkan Admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_transaksi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi_nyawers`
--

INSERT INTO `transaksi_nyawers` (`id_transaksi`, `reff_pg`, `nama_pengirim`, `user_id_pengirim`, `email_pengirim`, `user_id_penerima`, `nominal`, `pesan_pengirim`, `metode_pembayaran_id`, `biaya_admin`, `total_terima`, `link_bayar`, `waktu_transaksi`, `createdAt`, `updatedAt`, `status_transaksi`) VALUES
('2vzrO457d9', 'DS14804VCP80G66XMA7WCQ', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 10000, 'Semangat', 'BT', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BTZLMUBWW5KV6UA48', '2023-01-31 04:08:58', '2023-01-31 04:08:57', '2023-01-31 04:11:45', 'Sukses'),
('9hWRqhSKl0', 'DS14804S4FBBJ5TN8C831F', 'Jikky', '9dfjk1', 'jikky@me.com', 'kai29391', 200000, 'TEST J', 'BT', 4000, 196000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BTRBCO46ZJN11HQXF', '2023-01-31 03:28:13', '2023-01-31 03:28:12', '2023-01-31 03:29:12', 'Sukses'),
('APdDp4iPqk', 'DS148047U1ROQXBZSNP7V1', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 1000000, 'Semangat', 'BT', 4000, 996000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BTA84KEQ4X3XGY7ZG', '2023-01-30 10:18:35', '2023-01-30 10:18:34', '2023-01-30 10:18:34', 'Pending - Menunggu Pembayaran'),
('bXXBDELp6R', 'DS148044K4COOAJBMJOOZC', 'Test', 'tamu', 'tes@gmail.com', 'kai29391', 10000, 'Test', 'BT', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BTGOUB3D8GWDDFLT1', '2023-01-31 05:24:19', '2023-01-31 05:24:18', '2023-01-31 05:24:18', 'Pending - Menunggu Pembayaran'),
('EgJBZ7olVN', 'DS148047RHIK400IVN4ABM', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', '9dfjk1', 10000, 'Semangat', 'BR', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BRIVL0YOARYSJB12L', '2023-01-31 03:20:34', '2023-01-31 03:20:33', '2023-01-31 03:21:46', 'Sukses'),
('hiXKglALd8', 'DS14804ER5CVCAR7KCX00X', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'Nffi', 10000, 'Semangat', 'BR', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BRT74PPKPSGLN28Q2', '2023-01-30 13:43:26', '2023-01-30 13:43:25', '2023-01-30 13:43:25', 'Pending - Menunggu Pembayaran'),
('mLQYA2RvhO', 'DS148041ESB5Z3ZB1XKZO3', 'test', 'tamu', 'test@gmail.com', 'kai29391', 100000, 'test1212', 'BT', 4000, 96000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BT6MH74BC1SU3UDFE', '2023-01-31 05:27:00', '2023-01-31 05:26:59', '2023-01-31 05:31:34', 'Sukses'),
('NKtyYYOsRq', 'DS14804VPXDFS5EQXE0SI7', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 10000, 'Semangat', 'BR', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BRP2KHEOCH05R8L2K', '2023-01-30 09:51:26', '2023-01-30 09:51:25', '2023-01-30 09:52:04', 'Sukses'),
('pt7KY82CCB', 'DS14804ZSHJITQW6HWG5R5', 'Lukman Hakim', 'kai29391', 'lukman@me.com', '9dfjk1', 1000000, 'UAS', 'BT', 4000, 996000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BT4Z3HSEB1L3UN0DL', '2023-01-31 03:26:40', '2023-01-31 03:26:40', '2023-01-31 03:27:17', 'Sukses'),
('wbdrFbxkGU', 'DS14804GHZ0ZLBF4SY3J6C', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 10000, 'Semangat', 'BR', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BRX0M680Z7WXOSJJE', '2023-01-30 09:33:09', '2023-01-30 09:33:08', '2023-01-30 09:33:08', 'Pending - Menunggu Pembayaran'),
('zSrew7Qk9w', 'DS14804LKEEEXOS51M8LB8', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 10000, 'Semangat', 'BR', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BRPMZLPSDVK3WGHFD', '2023-01-30 16:42:43', '2023-01-30 16:42:42', '2023-01-30 16:42:42', 'Pending - Menunggu Pembayaran'),
('zYDx8AqDiB', 'DS14804UVX4IJ6BKOBGB0T', 'Cindy Andita Putri', 'tamu', 'cindy@me.com', 'kai29391', 10000, 'Semangat', 'BT', 4000, 6000, 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=BT8UEEXTG383IY2JQ', '2023-01-30 17:00:32', '2023-01-30 17:00:31', '2023-01-30 17:00:31', 'Pending - Menunggu Pembayaran');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` varchar(20) NOT NULL,
  `nama_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_telp` varchar(12) NOT NULL,
  `password` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_user` enum('Aktif','Tidak aktif') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `nama_user`, `username`, `email`, `no_telp`, `password`, `createdAt`, `updatedAt`, `status_user`) VALUES
('9dfjk1', 'Jikky', 'jikky', 'jikky@me.com', '628227819203', 'jikky123', '2023-01-28 19:55:13', '2023-01-31 03:30:17', 'Aktif'),
('kai29391', 'Lukman Hakim', 'lukman', 'lukman@me.com', '628919283747', 'Lukman123', '2023-01-28 19:55:13', '2023-01-29 21:38:54', 'Aktif'),
('Nffi', 'Cindy Andita Putri', 'cindy28', 'cindy@me.com', '628216328169', 'Cindy123', '2023-01-29 21:39:46', '2023-01-30 09:34:52', 'Aktif'),
('TAMU', 'Tamu', 'tamu', 'tamU@me.com', '6281234567', 'Tamu123', '2023-01-29 05:13:33', '2023-01-30 09:33:16', 'Aktif');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
