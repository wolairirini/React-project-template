import React,{Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {wanSet} from "../net_outside/action";
import {Spin,message} from "antd";

@connect(
    state=>({infos:state.net_outside.infos,proto:state.net_outside.proto,loading:state.net_outside.loading}),
    dispatch=>bindActionCreators({wanSet},dispatch)
)

export default class NetOutsideBroadband extends Component{
    constructor(props){
        super(props);
        this.state={
            username:null,
            password:null,
            dns0:null,
            dns1:null,
            mtu:null,
            macaddr:null,
            check_username:null,
            check_password:null,
            check_dns0:null,
            check_dns1:null,
            check_mtu:null,
            check_macaddr:null,
        }
    }
    render(){
        const {infos,proto,loading} = this.props;
        let {username,password,dns0,dns1,mtu,macaddr,check_dns0,check_dns1,check_macaddr,check_mtu,check_password,check_username} = this.state;
        // 无关页面不显示默认信息
        let infosx;
        if(proto==='pppoe'){
            infosx = infos;
        }else{
            infosx = Object.assign({},{mtu:infos.mtu,macaddr:infos.macaddr});
        }
        return(
            <Spin spinning={loading} size='large' tip="Loading...">

            <form onSubmit={(event)=>this.handleSubmit(event)}>
                <div className="input-group">
                    <label>宽带账号：</label>
                    <input required name='username' ref='username' onChange={(e)=>this.handleUsernameChange(e.target.value)} value={username!==null?username:infosx.username} type="text" />
                    <span className='icon'>*</span>
                    <p style={{display:check_username?'block':'none'}} className='alert'>用户名限制在64个字符以内</p>
                </div>
                <div className="input-group">
                    <label>宽带密码：</label>
                    <input required name='password' ref='password' onChange={(e)=>this.handlePasswordChange(e.target.value)} value={password!==null?password:infosx.password} type="password" />
                    <span className='icon'>*</span>
                    <p style={{display:check_password?'block':'none'}} className='alert'>密码限制在32个字符以内</p>
                </div>
                <div className="input-group">
                    <label>自定义首选DNS：</label>
                    <input  name='dns0' ref='dns0' onChange={(e)=>this.handledns0Change(e.target.value)} value={dns0!==null?dns0:infosx.dns?infosx.dns.length>0?infosx.dns[0]:'':''} type="text" />
                    <p style={{display:check_dns0?'block':'none'}} className='alert'>DNS格式错误</p>
                </div>
                <div className="input-group">
                    <label>自定义备用DNS：</label>
                    <input name='dns1' ref='dns1' onChange={(e)=>this.handledns1Change(e.target.value)} value={dns1!==null?dns1:infosx.dns?infosx.dns.length>1?infosx.dns[1]:'':''} type="text" />
                    <p style={{display:check_dns1?'block':'none'}} className='alert'>DNS格式错误</p>
                </div>
                <div className="input-group">
                    <label>设置MTU：</label>
                    <input name='mtu' ref='mtu' onChange={(e)=>this.handleMtuChange(e.target.value)} value={mtu!==null?mtu:infosx.mtu} type="number" />
                    <p style={{display:check_mtu?'block':'none'}} className='alert'>MTU应在128-1452之间</p>
                </div>
                <div className="input-group">
                    <label>克隆MAC地址：</label>
                    <input name='macaddr' ref='macaddr' onChange={(e)=>this.handleMacChange(e.target.value)} value={macaddr!==null?macaddr:infosx.macaddr} type="text" />
                    <p style={{display:check_macaddr?'block':'none'}} className='alert'>MAC地址格式错误</p>
                </div>
                <div className="btns">
                    <button disabled={loading} type="submit" className="btns-ok">确定</button>
                    <button disabled={loading} type="reset" className="btns-reset">取消</button>
                </div>
            </form>
            </Spin>

        )
    }
    handleSubmit(e){
        e.preventDefault?e.preventDefault():e.returnValue=false;
        const {wanSet,infos} = this.props;
        let {username,password,dns0,dns1,mtu,macaddr,check_dns0,check_dns1,check_macaddr,check_mtu,check_password,check_username} = this.state;

        username = username!==null?username:this.refs.username.value;
        password = password!==null?password:this.refs.password.value;
        dns0 = dns0!==null?dns0:this.refs.dns0.value;
        dns1 = dns1!==null?dns1:this.refs.dns1.value;
        mtu = mtu!==null?mtu:this.refs.mtu.value;
        macaddr = macaddr!==null?macaddr:this.refs.macaddr.value;
        // 校验
        check_username = username.length>64;
        check_password = password.length>32;
        check_dns0 = !global.exp.ip.test(dns0)?dns0!==''?true:false:false;
        check_dns1 = !global.exp.ip.test(dns1)?dns1!==''?true:false:false;
        check_mtu = !(mtu>=128&&mtu<=1452)?mtu!==''?true:false:false;
        check_macaddr = !global.exp.mac.test(macaddr)?macaddr!==''?true:false:false;
        console.log(check_username,check_password,check_dns0,check_dns1,check_macaddr,check_mtu)
        if(check_username||check_password||check_dns0||check_dns1||check_macaddr||check_mtu){
            message.warn('请输入合法的内容');
            this.setState({
                check_dns0,check_dns1,check_macaddr,check_mtu,check_username,check_password
            })
            return;
        }

        let data = {
            username,
            password,
            dns:[dns0,dns1],
            mtu,
            macaddr,
            proto:'pppoe'
        }
        data = Object.assign({},infos,data);
        wanSet(data);
    }
    handleUsernameChange(value){
        let {check_username} = this.state;
        if((value.length>64)&&value!==''){
            check_username = true;
        }else{
            check_username = false;
        }
        this.setState({
            username:value,
            check_username
        })
    }
    handlePasswordChange(value){
        let {check_password} = this.state;
        if((value.length>32)&&value!==''){
            check_password = true;
        }else{
            check_password = false;
        }
        this.setState({
            password:value,
            check_password
        })
    }
    handledns0Change(value){
        let {check_dns0} = this.state;
        if(!global.exp.ip.test(value)&&value!==''){
            check_dns0 = true;
        }else{
            check_dns0 = false;
        }
        this.setState({
            dns0:value,
            check_dns0
        })
    }
    handledns1Change(value){
        let {check_dns1} = this.state;
        if(!global.exp.ip.test(value)&&value!==''){
            check_dns1 = true;
        }else{
            check_dns1 = false;
        }
        this.setState({
            dns1:value,
            check_dns1
        })
    }
    handleMtuChange(value){
        let {check_mtu} = this.state;
        if((value<128||value>1452)&&value!==''){
            check_mtu = true;
        }else{
            check_mtu = false;
        }
        this.setState({
            mtu:value,
            check_mtu
        })
    }
    handleMacChange(value){
        let {check_macaddr} = this.state;
        if(!global.exp.mac.test(value)&&value!==''){
            check_macaddr = true;
        }else{
            check_macaddr = false;
        }
        this.setState({
            macaddr:value,
            check_macaddr
        })
    }
}