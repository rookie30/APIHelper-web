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
          <el-menu-item index="read">
            <span class="category-title">已读消息</span>
            <el-badge style="margin-left: 10px" class-name="gray-dadge" ></el-badge>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="message-page-con message-list-con">
        <el-menu 
          v-loading="listLoading">
          <el-menu-item 
            v-for="item in messageList"
            :name="item.id" 
            :key="item.id"
            :index="item.id"
            class="message-list-item"
            @click="handelView(item)">
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
import { getNoticeList, setReadNotice } from '@/api/system/notice';

const listDic = {
  unread: 'noticeUnreadList',
  read: 'noticeReadList',
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
      noticeUnreadList: [], // 未读消息
      noticeReadList: [], // 已读消息
      readList: [], // 用户已读的信息列表
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
      this.currentMessageType = name;
      if(JSON.stringify(this.showingMsgItem) != '{}' && this.showingMsgItem.type == 0) {
          let readItem = this.showingMsgItem;
          let index = this.noticeUnreadList.findIndex(item => item.id == readItem.id);
          this.noticeUnreadList.splice(index, 1);
          this.noticeReadList.push(readItem);
      }
      this.showingMsgItem = {};
      this.messageContent = '';
      
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
      let readList = new Array();
      noticeList.forEach(item => {
        item.id += '';
        if(item.type == 0) {
          unreadList.push(item);
        } else {
          readList.push(item);
        }
      });
      this.noticeUnreadList = unreadList;
      this.noticeReadList = readList;
    },
    /**
     * 消息项点击后处理事件
     */
    handelView(noticeItem) {
      // 根据选择的消息类型从对应的消息列表中查找消息
      if(this.currentMessageType == 'unread') {
        // 判断之前是否有显示的未读项，若有则标记为已读
        if(JSON.stringify(this.showingMsgItem) != '{}' && this.showingMsgItem.type == 0) {
          let readItem = this.showingMsgItem;
          readItem.type = 1;
          let index = this.noticeUnreadList.findIndex(item => item.id == readItem.id);
          this.noticeUnreadList.splice(index, 1);
          this.noticeReadList.push(readItem);
        }
        let item = this.noticeUnreadList.find(item => item.id == noticeItem.id);
        this.showingMsgItem = item;
        this.messageContent = item.content;
        this.readList.push(item);
      } else {
        let item = this.noticeReadList.find(item => item.id == noticeItem.id);
        this.showingMsgItem = item;
        this.messageContent = item.content;
      }
    },
    /**
     * 将消息标记为已读
     */
    setRead() {
      if(this.readList.length != 0) {
        setReadNotice(this.readList).then(res => {
          // console.log(res);
        }).catch(err => {
          console.log(err);
        });
      }
      // console.log(this.readList);
    }
  },
  created() {
    this.getNotice();
  },
  destroyed() {
    this.setRead();
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