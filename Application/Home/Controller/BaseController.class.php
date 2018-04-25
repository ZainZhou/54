<?php
namespace Home\Controller;
use Think\Controller;
class BaseController extends Controller {
    public function _initialize(){
        header('Access-Control-Allow-Origin: *');
        if (APP_DEBUG) {
            $openid = 'ouRCyjhdsj8RQofIOPHc7nX9hA983';//session('openid');//
            $nickname = '知识混子周政3';// session('nickname'); //
        } else {
            $openid = session('openid');//
            $nickname = session('nickname'); //
        }
        if (!$openid || !$nickname) {
            $openid = I('get.openid');
            $nickname = urldecode(I('get.nickname'));//'知识混子周政';//
        }
        if (!$openid  || !$nickname) {
            $uri = 'https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/Api/Api/oauth&redirect='.urlencode('https://'.$_SERVER['HTTP_HOST']. '/game' .$_SERVER['REQUEST_URI']);
            redirect($uri);
        }
        session('openid', $openid);
        session('nickname', $nickname);
        $users = M('users');
        $num = $users->where(array('openid' => $openid))->count();
        if ($num == 0) {
            $data = array(
                'openid' => $openid,
                'nickname' => $nickname,
                'imgurl' => urldecode(I('get.headimgurl')),
            );
            $users->add($data);
        } else {
            $img = I('get.headimgurl');
            if ($nickname && $img) {
                $data['nickname'] = $nickname;
                $data['imgurl'] = urldecode($img);
                $users->where(array('openid' => $openid))->save($data);
            }
        }
    }
}