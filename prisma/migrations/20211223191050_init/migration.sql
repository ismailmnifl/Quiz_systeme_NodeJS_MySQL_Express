-- CreateTable
CREATE TABLE `questions` (
    `question_index` INTEGER NOT NULL AUTO_INCREMENT,
    `user_index` INTEGER NOT NULL,
    `test_index` INTEGER NOT NULL,
    `question` VARCHAR(255) NOT NULL,
    `dateCreated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `test_index`(`test_index`),
    INDEX `user_question_fk`(`user_index`),
    PRIMARY KEY (`question_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reponces` (
    `responce_index` INTEGER NOT NULL AUTO_INCREMENT,
    `question_index` INTEGER NOT NULL,
    `responce` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `dateCreated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `question_responce_fk`(`question_index`),
    PRIMARY KEY (`responce_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_index` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`role_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject` (
    `subject_index` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `dateCreated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`subject_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test` (
    `test_index` INTEGER NOT NULL AUTO_INCREMENT,
    `referance` VARCHAR(255) NOT NULL,
    `subject_index` INTEGER NOT NULL,
    `user_index` INTEGER NOT NULL,
    `dateCreated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `subject_index`(`subject_index`),
    INDEX `user_index`(`user_index`),
    PRIMARY KEY (`test_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_index` INTEGER NOT NULL AUTO_INCREMENT,
    `role_index` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    INDEX `user_role_fk`(`role_index`),
    PRIMARY KEY (`user_index`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`test_index`) REFERENCES `test`(`test_index`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `user_question_fk` FOREIGN KEY (`user_index`) REFERENCES `users`(`user_index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reponces` ADD CONSTRAINT `question_responce_fk` FOREIGN KEY (`question_index`) REFERENCES `questions`(`question_index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test` ADD CONSTRAINT `test_ibfk_1` FOREIGN KEY (`subject_index`) REFERENCES `subject`(`subject_index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `test` ADD CONSTRAINT `test_ibfk_2` FOREIGN KEY (`user_index`) REFERENCES `users`(`user_index`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `user_role_fk` FOREIGN KEY (`role_index`) REFERENCES `roles`(`role_index`) ON DELETE RESTRICT ON UPDATE RESTRICT;
