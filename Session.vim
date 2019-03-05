let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd /mnt/c/Users/xion/Rec-Survey
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 ~/.config
badd +1 app.js
badd +16 .eslintrc.json
badd +66 .gitignore
badd +1 src/user/init.js
badd +1 src/mongo/control.js
badd +14 term://.//7465:/bin/bash
badd +1 terminal
badd +1 term://.//7464:/bin/bash
badd +1 db_struct.md
badd +1 src/survey/index.js
badd +1 src/user/index.js
badd +1 src/survey/init.js
badd +1 src/index.js
badd +1 src/commons/null-checker.js
badd +1 src/commons/index.js
badd +1 src/mongo/index.js
badd +1 src/websocket/socketHandler.js
badd +1 src/views/vue.config.js
badd +1 src/views/src/login/main.js
badd +1 src/views/src/entry-point/login/main.js
badd +1 src/views/src/entry-point/survey/main.js
badd +1 src/views/public/login.html
badd +1 src/views/public/index.html
badd +1 src/views/public/survey.html
badd +1 src/views/src/LoginApp.vue
badd +1 src/views/src/SurveyApp.vue
badd +4 src/views/src/components/Card.vue
badd +1 src/views/public/css/commons.css
badd +1 src/views/src/config/config.js
badd +1 index.js
badd +2 src/views/src/config/index.js
badd +1 src/views/public/js/index.js
badd +1 src/views/src/components/Toolbar.vue
badd +1 src/views/public/js/faceDetectionControls.js
badd +1 src/views/src/components/Loader.vue
argglobal
silent! argdel *
$argadd app.js
edit src/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winminwidth=1 winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 29) / 59)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 05|
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=1 winminheight=1 winminwidth=1 shortmess=aoO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
