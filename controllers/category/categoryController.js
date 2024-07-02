const categoryService = require('../../service/categories/categoryService');

// 创建新的分类
const createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取所有分类
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个分类信息
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新分类信息
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 删除分类信息（软删除）
const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 恢复被软删除的分类
const restoreCategory = async (req, res) => {
  try {
    await categoryService.restoreCategory(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取被软删除的分类
const getDeletedCategories = async (req, res) => {
  try {
    const deletedCategories = await categoryService.getDeletedCategories();
    res.status(200).json(deletedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取某个分区下的所有分类
const getCategoriesBySection = async (req, res) => {
  try {
    const categoriesList = await categoryService.getCategoriesBySection(req.params.section_id);
    res.status(200).json(categoriesList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getDeletedCategories,
  getCategoriesBySection
};
