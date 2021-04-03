<template>
  <el-card >
    <div class="container">
      <div class="message-page-con message-category-con">
        <el-menu 
          width="auto" 
          default-active="unread"   
          @select="handleSelect">
          <el-menu-item index="unread">
            <span class="category-title">未读消息</span>
            <el-badge style="margin-left: 10px" ></el-Badge>
          </el-menu-item>
          <el-menu-item index="readed">
            <span class="category-title">已读消息</span>
            <el-badge style="margin-left: 10px" class-name="gray-dadge" ></el-badge>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="message-page-con message-list-con">
        <!-- <Spin fix v-if="listLoading" size="large"></Spin> -->
        <el-menu 
          v-loading="listLoading"
          @select="handelView">
          <el-menu-item 
            v-for="item in messageList"
            :name="item.id" 
            :key="item.id"
            :index="item.id.toString()"
            class="message-list-item">
            <div class="message-list-content">
                <span class="item-title">
                  {{ item.title }}
                </span>
                <span class="item-time">
                  {{ item.createTime }}
                </span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="message-page-con message-view-con">
        <!-- <Spin fix v-if="contentLoading" size="large"></Spin> -->
        <div class="message-view-header">
          <h2 class="message-view-title">
            {{ showingMsgItem.title }}
          </h2>
          <time class="message-view-time">
            {{ showingMsgItem.createTime }}
          </time>
        </div>
        <div v-html="messageContent"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getNoticeList } from '@/api/system/notice';

const listDic = {
  unread: 'noticeUnreadList',
  readed: 'noticeReadedList',
}
export default {
  name: 'message_page',
  data () {
    return {
      listLoading: false,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {},
      noticeUnreadList: [],
      noticeReadedList: [],
    }
  },
  computed: {
      messageList () {
        return this[listDic[this.currentMessageType]]
      },
  },
  methods: {
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.currentMessageType = name
    },
    /**
     * 获取通知
     */
    getNotice() {
      this.listLoading = true;
      getNoticeList().then(res => {
        // console.log(res);
        if(res.status == '200') {
          this.noticeHandler(res.noticeList);
        } else {
          throw new Error('获取通知信息失败');
        }
      }).catch(err => {
        console.log(err);
        this.$message.error(err);
      }).finally(() => {
        this.listLoading = false;
      });
    },
    /**
     * 通知分类处理器
     */
    noticeHandler(noticeList) {
      let unreadList = new Array();
      let readedList = new Array();
      noticeList.forEach(item => {
        if(item.type == 0) {
          unreadList.push(item);
        } else {
          readedList.push(item);
        }
      });
      this.noticeUnreadList = unreadList;
      this.noticeReadedList = readedList;
    },
    handelView(key) {
      const list = this.messageList;
      const noticeItem = list.find(item => item.id == key);
      this.showingMsgItem = noticeItem;
      this.messageContent = noticeItem.content;
      if(this.currentMessageType == 'unread') {
        this.messageList.find(item => item.id == key).type = 1;
        let index = this.noticeUnreadList.findIndex(item => item.id == key);
        this.noticeUnreadList.splice(index, 1);
        this.noticeReadedList.push(this.messageList.find(item => item.id == key));
      }
    }
  },
  created() {
    this.getNotice();
  }
}
</script>

<style scoped>
.container {
    display: flex;
}
.message-list-item {
    height: 100px;
}
.message-list-con {
    width: 250px;
}
.message-list-content {
    display: flex;
    flex-direction: column;
}
.message-list-content .item-title {
    display: block;
    height: auto;
    font-size: 16px;
}
.message-list-content .item-time {
    display: block;
    height: 50px;
    font-size: 13px
}
</style>