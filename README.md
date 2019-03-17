# vue-init2(vue-cli3) 骨架

### 文件导入

\*.vue 文件中导入项目文件需要使用@，eg：

```html
<img alt="Vue logo" src="@/assets/logo.png">
```

```css
.item {
  background: url(~@/assets/bg.png);
}
```

```javascript
import HelloWorld from '@/components/HelloWorld.vue';
```
