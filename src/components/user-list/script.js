export default {
    async created () {
      this.loadUserByPage(1)
    },
    data () {
      return {
        searchText: '',
        tableData: [], // 表格列表数据
        totalSize: 0, // 总记录数据
        currentPage: 1, // 当前页码
        pageSize: 5, // 当前每页大小
        userForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        editUserForm: {
          username: '',
          email: '',
          mobile: ''
        },
        dialogFormVisible: false, // 用来控制添加用户对话框的显示和隐藏
        dialogEditFormVisible: false, // 用来控制编辑用户对话框的显示和隐藏
        addUserFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入电话号', trigger: 'blur' }
          ]
        },
        editUserFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入电话号', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      async handleSizeChange (pageSize) {
        this.pageSize = pageSize
        this.loadUserByPage(1, pageSize)
      },
      async handleCurrentChange (currentPage) {
        this.loadUserByPage(currentPage)
      },
      handleSearch () {
        // console.log(this.searchText)
        this.loadUserByPage(1)
      },
      async handleStateChange (state, user) {
        // 拿到用户id
        // 拿到switch 开关的选中状态 val
        // 发起请求改变状态
        const {id: userId} = user
        const res = await this.$http.put(`/users/${userId}/state/${state}`)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: `用户状态${state ? '启用' : '禁用'}成功`
          })
        }
      },
      async loadUserByPage (page) {
        const res = await this.$http.get('/users', {
          params: {
            pagenum: page,
            pagesize: this.pageSize,
            query: this.searchText
          }
        })
        const {users, total} = res.data.data
        // console.log(users)
        this.tableData = users
        this.totalSize = total
      },
      async handleAddUser () {
        // 获取表单数据
        // 表单验证
        // 发起请求添加数据
        // 根据响应做交互
        // 添加用户成功，给出提示
        // 关闭对话框
        // 重新加载当前列表数据
  
        this.$refs['addUserForm'].validate(async (valid) => {
          if (!valid) {
            return false
          }
          // 代码执行到这里表示表单通过
          const res = await this.$http.post('/users', this.userForm)
          if (res.data.meta.status === 201) {
            // 添加成功提示消息
            this.$message({
              type: 'success',
              message: '添加用户成功'
            })
            // 关闭对话框
            this.dialogFormVisible = false
  
            // 重新加载用户列表数据
            this.loadUserByPage(this.currentPage)
  
            // 清空表单内容
            for (let key in this.userForm) {
              this.userForm[key] = ''
            }
          }
        })
      },
      async handleDeleteUser (user) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => { // 点击确认执行该方法
          const res = await this.$http.delete(`/users/${user.id}`)
          if (res.data.meta.status === 200) {
              this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 删除成功，重新加载当前数据
            this.loadUserByPage(this.currentPage)
          }
        }).catch(() => { // 点击取消执行该方法
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      async handleEditUser () {
        const {id: userId} = this.editUserForm
        const res = await this.$http.put(`/users/${userId}`, this.editUserForm)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '更新用户成功'
          })
          this.dialogEditFormVisible = false // 关闭编辑用户表单对话框
          this.loadUserByPage(this.currentPage) // 重新加载当前页数据
        }
      },
      // 处理显示被编辑的用户表单信息
      async handleShowEditForm (user) {
        this.dialogEditFormVisible = true
        const res = await this.$http.get(`/users/${user.id}`)
        this.editUserForm = res.data.data
      }
    }
  }