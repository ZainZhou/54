<?php
namespace Home\Controller;
use Org\Util\TPString;
use Org\Util\Date;

class IndexController extends BaseController {
    private $appid = 'wx81a4a4b77ec98ff4';
    private $acess_token = 'gh_68f0a1ffc303';
    public function index() {
        $openid = session('openid');
        $user = M('users')->where(array('openid' => $openid))->find();
        $signature = $this->JSSDKSignature();
        $this->assign('nickname', $user['nickname']);
        $this->assign('avatar', $user['imgurl']);
        $this->assign('signature', $signature);
        $this->assign('appid', $this->appid);
        $this->display();
    }

    public function getcontent() {
        $time = I('post.time');
        $username = I('post.username');
        $d = new Date($time);
        if ($d->parse($time) > time()){
           $this->ajaxReturn(array(
               'status' => 403,
               'info' => '非法时间'
           ));
        }
        $strs = array(
            '操你妈',
            '妈的',
            '我日'
        );
        foreach ($strs as $str) {
            if (stripos($username, $str) !== false) {
                $this->ajaxReturn(array(
                    'status' => 405,
                    'info' => '非法字符'
                ));
                return;
            }
        }
        $year = $d->format("%Y");
        $event = M('event')->where(array('year' => $year))->getField('event');
        $story = M('story')->order('rand()')->find();
        $this->ajaxReturn(array(
            'status' => 200,
            'data' => array(
                'keyword' => $story['keyword'],
                'days' => ceil($d->dateDiff(time())),
                'event' => $event,
                'describe' => $story['describe']
            )
        ));
    }

    public function JSSDKSignature(){
        $string = new TPString();
        $jsapi_ticket =  $this->getTicket();
        $data['jsapi_ticket'] = $jsapi_ticket['data'];
        $data['noncestr'] = $string->randString();
        $data['timestamp'] = time();
        $data['url'] = 'https://'.$_SERVER['HTTP_HOST'].__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }
    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }


    /*curl通用函数*/
    private function curl_api($url, $data=''){
        // 初始化一个curl对象
        $ch = curl_init();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        // 运行curl，获取网页。
        $contents = json_decode(curl_exec($ch), true);
        // 关闭请求
        curl_close($ch);
        return $contents;
    }

    private function getTicket() {
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string='';
        for($i=0;$i<16;$i++){
            $num = mt_rand(0,61);
            $string .= $str[$num];
        }
        $secret =sha1(sha1($time).md5($string)."redrock");
        $t2 = array(
            'timestamp'=>$time,
            'string'=>$string,
            'secret'=>$secret,
            'token'=>$this->acess_token,
        );
        $url = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket";
        return $this->curl_api($url, $t2);
    }
}
