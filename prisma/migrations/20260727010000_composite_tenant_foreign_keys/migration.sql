-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_menu_item_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_table_id_fkey";

-- DropForeignKey
ALTER TABLE "staff_calls" DROP CONSTRAINT "staff_calls_table_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_id_organization_id_key" ON "menu_categories"("id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_id_organization_id_key" ON "menu_items"("id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_organization_id_key" ON "orders"("id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tables_id_organization_id_key" ON "tables"("id", "organization_id");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_organization_id_fkey" FOREIGN KEY ("category_id", "organization_id") REFERENCES "menu_categories"("id", "organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_organization_id_fkey" FOREIGN KEY ("table_id", "organization_id") REFERENCES "tables"("id", "organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_organization_id_fkey" FOREIGN KEY ("order_id", "organization_id") REFERENCES "orders"("id", "organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_organization_id_fkey" FOREIGN KEY ("menu_item_id", "organization_id") REFERENCES "menu_items"("id", "organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_calls" ADD CONSTRAINT "staff_calls_table_id_organization_id_fkey" FOREIGN KEY ("table_id", "organization_id") REFERENCES "tables"("id", "organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

