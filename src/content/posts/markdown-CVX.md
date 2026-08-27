---
title: CVX
published: 2026-08-27
description: '这是一篇关于Matlab工具箱CVX的学习笔记，用于后续的凸优化处理'
image: ''
tags: [凸优化，CVX]
category: '算法优化'
draft: false
lang: ''
slug: markdown-CVX(1)
---

## CVX基础语法
* **框架**：cvx_begin + 声明变量 + 目标 + 约束 + cvx_end

| 命令 | 作用 |
|:----|:-----|
| cvx_begin/cvx_end | 必须成对出现，包裹所有优化代码 |
| quiet | 不显示求解过程，优化速度（加在cvx_begin后面）|
| sdp | 启用半正定规划模式（处理矩阵半正定约束时使用）|

* **变量**：用variable声明，用法如下表 

| 代码 | 含义 |
|:-----|:-----|
| variable x | 声明实数标量 |
| variable x(n) | 声明n维实数向量 |
| variable X(m,n) | 声明m x n维实数矩阵 |
| variable x(n) complex | 声明n维复数向量 |
| variable X(m,n) complex | 声明mxn维复数矩阵 |
| variable x(n) nonnegative | 声明非负向量( $x \geqslant 0$ ) |
| variable X(n,n) symmetric | 声明实对称矩阵 |
| variable X(n,n) hermitian | 声明复 Hermitian 矩阵 (即 X = X^H)|
| variable X(n,n) semidefinite | 声明半正定矩阵 ($X \succeq 0$) |

* **核心约束规则**：整体约束必须为凸约束

## CVX关键规则
CVX不是任何数学表达式都能就受的。他要求整个问题必须是凸的。

### **规则一**：目标函数必须符合凸性
* minimize 后面的表达式必须是凸函数（如norm、sum、quad_form）
* maximize 后面的表达式必须是凹函数（如log、geo_mean）

### **规则二**：约束的左右结构有限制
| 约束类型 | 左侧要求 | 右侧要求 | 合法示例 | 非法示例 |
|:-------:|:-------:|:--------:|:-------:|:-------:|
| <= | 凸 | 凹 | norm(x) <= 1 | 1 <= norm(x) |
| >= | 凹 | 凸 | 1 >= norm(x) | norm(x) >= 1 |
| == | 仿射 | 仿射 | A*b == b | norm(x) == 1 |

**常用函数的凹凸性:**
| 类型 | 常见函数 | 说明 |
|:-----|:-------|:-----|
| 仿射 | +, -, *, /（常数除法）, real, imag, conj, trace, diag, sum, vec, reshape | 线性运算，既是凸也是凹 |
| 凸 | norm, norm(x, p), quad_form, sum_square, max，abs（实数），square, inv_pos, log_sum_exp | 可用于 <= 的左侧或minimize |
| 凹 | log,log_det,geo_mean,sqrt | 可用于 >= 的左侧或maximize |

## 相关代码示例
```matlab title="my_first_cvx_code"
clear; clc;
K = 4; % 用户数
M = 4; % 基站天线数
sigma = 1; % 噪声标准差（噪声功率 = 1）
num_realizations = 10; % 每个gamma值下的随机信道次数（可调，大一点更平滑）

% 定义要扫描的gamma范围（线性值）
gamma_vec = 0.5:0.5:4; % 从 0.5 到 4，步长 0.5
avg_power = zeros(size(gamma_vec)); % 存储每个 gamma 对应的平均功率

fprintf('开始扫描不同 gamma 值……\n');
for g_idx = 1:length(gamma_vec)
    gamma = gamma_vec(g_idx);
    power_sum = 0;
    valid_count = 0;

    for z = 1:num_realizations
        H = randn(K,M); % 随机信道

        cvx_begin quiet
            variable tau nonnegative
            variable W(M,K) complex
            minimize(tau)
            subject to
                for i = 1:K
                    % SINR 约束（含噪声）
                    norm([H(i,:) * W,sigma]) <= sqrt(1 + 1/gamma) * real(H(i,:) * W(:,i));
                    % 强制接收信号为实数且非负
                    imag(H(i,:) * W(:,i)) == 0;
                    real(H(i,:) * W(:,i)) >= 0;
                end
                norm(vec(W)) <= sqrt(tau);
        cvx_end

        % 检查求解状态，只累加成功求解的结果
        if strcmp(cvx_status, "Solved")
            power_sum = power_sum + tau;
            valid_count = valid_count + 1;
        else
            % 若不行，忽略该次实现（或可记录失败次数）
            % fprintf('gamma = %.2f,第 %d 次不可行\n',gamma,z);
        end
    end

    if valid_count > 0
        avg_power(g_idx) = power_sum / valid_count;
        fprintf('gamma = %.2f，有效次数 = %d，平均功率 = %.4f\n',gamma,valid_count,avg_power(g_idx));
    else
        avg_power(g_idx) = NaN; % 若全部不可行，置NaN
        fprintf('gamma = %.2f，无可行的信道实现!\n',gamma);
    end
end

% 绘图
figure;
plot(gamma_vec,avg_power,'b-o','LineWidth',2);
xlabel('SINR 门限 \gamma（线性值）');
ylabel('平均最小发射功率(||W||_F^2)');
title(['M=', num2str(M), ', K=', num2str(K), ', 噪声功率 \sigma^2=', num2str(sigma^2), ...
       ', 每个\gamma下随机信道次数=', num2str(num_realizations)]);
grid on;
```

---

## 信号模型（只包含公式）

$$
x_i = w_i s_i 
$$

$$
y_i = h_i w_i s_i + \sum_{j\neq i}h_i w_j s_j + n_i
$$

## 功率最小化问题

基站总发射功率为 $\sum_{i=1}^{K}Tr(X_u)$ 。用户i的信干噪比（SINR）定义为

$$
SINR_i = \frac{h_i X_i h_i^H}{\sum_{j \neq i}h_i X_j h_i^H + \sigma^2} \geq \gamma
$$

要求 $SINR_i \geq \gamma$，其中 $\gamma \geq 0$ 是目标门限。则优化问题可写为

$$
\min_{\{Xi\}} \sum_{i=1}^{K}Tr(X_i)
$$

$$
\begin{aligned}
\text{subject to} \quad \frac{h_i X_i h_i^H}{\sum_{j \neq i}h_i X_j h_i^H + \sigma^2} \geq \gamma, \forall i, \\
X_i \succeq 0, rank(X_i) \leq 1, \forall i,
\end{aligned}
$$

其中 $X_i \succeq 0$ 表示半正定。秩一约束来自 $ X_i = w_i w_i^H $ ,这使得问题非凸。

## 半正定松弛
### 松弛问题
松弛掉秩一约束，仅保留半正定约束，得到松弛问题

$$
\underset{\{X_i\} , \{s_i\}}{\text{minimize}} \quad \sum_{i = 1}^{K} Tr{X_i}
$$

$$
\begin{aligned}
\text{subject to} \quad & \operatorname{Tr}(H_i X_i) - \gamma \sum_{j \neq i} \operatorname{Tr}(H_i X_j) \geq \gamma \sigma^2, \quad \forall i, \\
& X_i \succeq 0, \quad \forall i
\end{aligned}
$$

其中 $ H_i = h_i^H h_i $ 是 M x M 的秩一Hermitian矩阵，且 $ H_i \succeq 0 $ 。为将不等式约束转化为为等式以便数值求解，引入非负松弛变量 $ s_i \geq 0 $ ，使

$$
\operatorname{Tr}{H_i X_i} - \gamma \sum_{j \neq i} \operatorname{Tr}{H_i X_j} - s_i = \gamma \sigma^2
$$

这样约束变为线性等式，目标函数线性，可行域为半正定锥于线性等式的交集，因此是凸的半定规划问题。  
SDP松弛的最优值给出了原问题的最优功率的下界。若存在最优解满足秩一，则松弛是紧的，该解即为原始问题的最优波形成束。即使出现秩大于一1，也可通过高斯随机化等后处理步骤获得良好的可行波束成形向量。
> SDP的最优解 $ P_{SDP} $ 是原始问题最优解 $P^*$ 的下界，即 $P_{SDP} \leq P^*$ 。然而，SDP的解 $ X_i^* $ 不一定满足秩一条件，无法直接作为波束成形向量使用。高斯随机化正是通过概率抽样从 $ X_i^* $ 中生成候选向量，并从中筛选出满足原始约束的可行解，从而获得 $P^*$ 的一个上界

## 相关代码实现
```matlab title="cvx_SDP.m"
clear;clc;

%======= 系统参数 =======
K = 4;              % 用户数
M = 4;              % 基站天线数
sigma2 = 0.025^2;   % 噪声功率
num_realizations = 20;  % 每个 gamma 下的信道样本数

% 扫描的SINR门限（线性值）
gamma_vec = 0.5:0.5:3;
avg_power = zeros(size(gamma_vec));

fprintf('开始扫描不同 gamma 值（SDP方法）……\n');

for g_idx = 1:length(gamma_vec)
    gamma = gamma_vec(g_idx);
    power_sum = 0;
    valid_count = 0;

    for z = 1:num_realizations
        % ----- 生成信道 ------
        H_ch = randn(K,M);      % 实高斯信道（方差一）
        H = zeros(M,M,K);       % M * M * K维矩阵
        for i = 1:K
            h_i = H_ch(i,:);    % 1 * M
            H(:,:,i) = h_i' * h_i; % M * M 半正定
        end

        % ------ SDP 求解 --------
        cvx_begin quiet
            variable X(M,M,K) complex
            variable s(K,1) nonnegative

            % 目标函数：总发射功率（取实部）
            obj = 0;
            for i = 1:K
                obj = obj + real(trace(X(:,:,i)));
            end
            minimize(obj)

            subject to
                for i = 1:K
                    % 信号项
                    sig = real(trace(H(:,:,i) * X(:,:,i)));
                    % 干扰项
                    cstr = 0;
                    for j = 1:K
                        if j ~= i
                            cstr = cstr + real(trace(H(:,:,i) * X(:,:,j)));
                        end
                    end
                    % SINR 约束
                    sig - gamma * cstr - s(i) == gamma * sigma2;
                    % 半正定约束
                    X(:,:,i) == hermitian_semidefinite(M);
                end
        cvx_end

        if strcmp(cvx_status, 'Solved')
            power_sum = power_sum + obj;
            valid_count = valid_count + 1;
        end
    end

    if valid_count > 0
        avg_power(g_idx) = power_sum / valid_count; % 取结果的平均值一克服随机性（蒙特卡洛仿真）
        fprintf('gamma = %.2f，有效次数 = %d，平均功率 = %.4f\n',gamma,valid_count,avg_power(g_idx));
    else
        avg_power(g_idx) = NaN;
        fprintf('gamma = %.2f，无可实行的信道实现!\n',gamma);
    end
end

% ========== 绘图 ==========
figure;
plot(gamma_vec, avg_power, 'b-o', 'LineWidth', 2);
xlabel('SINR 门限 \gamma (线性值)');
ylabel('平均最小发射功率 (总功率)');
title(['M=', num2str(M), ', K=', num2str(K), ', 噪声功率 \sigma^2=', num2str(sigma2), ...
       ', 每个\gamma下随机信道次数=', num2str(num_realizations)]);
grid on;
```
---
## 最优性分析
* **SDR求解的是松弛问题**：将原始非凸问题（秩一约束）放宽为半正定约束，可行域扩大，因此松弛问题的最优值 $ P_{SDR} $必定是原始问题最优值 $P^*$ 的下界
* **随机化构造的是可行解**：从SDR解出的协方差矩阵 $ X_i $中采样，得到一组 $ w_i $。只有当这些向量满足原始约束（如SINR门限）时，它们才是原问题的可行解。因此，该可行解对应的目标值（总功率）必定大于等于原始问题的最优值，即构成一个上界：

$$
P_{rand} \geq P^*
$$

将两者结合，必然得到：

$$
P_{SDR} \leq P^* \leq P^{rand}
$$

## 高斯随机化流程
在每一次信道实现中，完成SDP求解得到最优协方差矩阵 $\{X_i^*\}$ 后，执行以下高斯随机化流程：
1. 随机向量生成

    对每个用户i，从 $X_i^*$ 中独立采样一个复高斯随机向量 $r_i$。具体的，先对 $ X_i^* $ 进行特征分解并舍去负特征值（保证数值半正定），计算其平方根，再乘以标准复高斯向量，得到

    $$
    r_i = X_i^{* \\ 1/2} * \frac{u_i + j v_i}{\sqrt{2}},
    $$

    其中 $ u_i,v_i \thicksim N(0,I_M) $ 独立同分布。这样保证了 $E[r_i r_i^H] = X_i^*$
2. 可行性检验

    将生成的候选波束成形矩阵 $R = [r_1,...,r_K]$ 代入原始SINR表达式，计算每个用户的实际SINR：

    $$
    SINR_i = \frac{r_i^H H_i r_i}{\sum_{j \neq i}r_j^H H_i r_j + \sigma^2}
    $$
    
    若所有用户均满足 $ SINR_i \geq \gamma $，则该候选向量构成原问题的一个可行解；否则丢弃。
3. 最优可行解选取

    对通过检验的候选解，计算其总发射功率 $P_rand = \sum_{i} \begin{Vmatrix} r_i \end{Vmatrix}^2$。重复采样过程足够多次（通常需保证采样充分覆盖可行域），记录所有可行解中功率最小的一个，作为该信道实现的随机化上界。
4. 统计平均

    对同一 $\gamma$ 下的所有信道实现，若SDP可行且至少有一个随机化可行解，则分别累加SDP目标值和随机化最优功率，最后求平均，得到该 $\gamma$ 对应的平均下界和平均上界曲线。

## 相关代码实现
```matlab title="cvx_SDR.m"
clear;clc;close all;

% ============= 系统参数 ===============
K = 4;                      % 用户数
M = 4;                      % 基站天线数
sigma2 = 0.025^2;           % 噪声功率
num_realizations = 20;      % 每个 gamma 下的信道样本数
L = 200;                    % 随机化采样次数

gamma_vec = 0.5:0.5:3;
avg_power_sdp = zeros(size(gamma_vec));
avg_power_rand = zeros(size(gamma_vec));

fprintf('开始扫描不同gamma值（SDP + 随机化）...\n');

for g_idx = 1:length(gamma_vec)
    gamma = gamma_vec(g_idx);
    power_sum_sdp = 0;
    power_sum_rand = 0;
    valid_count = 0;

    for z = 1:num_realizations
        % ----- 生成信道 -------
        H_ch = randn(K,M);
        H = zeros(M,M,K);
        for i = 1:K
            h_i = H_ch(i,:);
            H(:,:,i) = h_i'*h_i;
        end

        % ----- SDP松弛求解（下界）------
        cvx_begin quiet
            variable X(M,M,K) complex
            variable s(K,1) nonnegative
            obj = 0;
            for i = 1:K
                obj = obj + real(trace(X(:,:,i)));
            end
            minimize(obj)
            subject to
                for i = 1:K
                    sig = real(trace(H(:,:,i) * X(:,:,i)));
                    cstr = 0;
                    for j = 1:K
                        if j ~= i
                            cstr = cstr + real(trace(H(:,:,i) * X(:,:,j)));
                        end
                    end
                    sig - gamma * cstr - s(i) == gamma * sigma2;
                    X(:,:,i) == hermitian_semidefinite(M);
                end
        cvx_end

        if ~strcmp(cvx_status,'Solved')
            continue;
        end

        % ---- 高斯随机化（构造上界）-------
        best_rand_power = inf;
        
        for l = 1:L
            W_rand = zeros(M,K);
            for i = 1:K
                Xi = X(:,:,i);
                [V,D] = eig(0.5*(Xi + Xi')); % 求矩阵A的全部特征值，构成对角阵D，并求A的特征向量构成V的列向量。
                D = max(real(D),0);
                Xi_sqrt = V * sqrt(D) * V';
                r = Xi_sqrt * (randn(M,1) + 1i*randn(M,1)) / sqrt(2);
                W_rand(:,i) = r;
            end

            % 计算每个用户的SINR
            SINRs = zeros(K,1);
            for i = 1:K
                w_i = W_rand(:,i);
                % 信号功率
                sig = real(w_i' * H(:,:,i) * w_i);
                % 干扰功率（来自其它用户）
                int = 0;
                for j = 1:K
                    if j ~= i
                        w_j = W_rand(:,j);
                        int = int + real(w_j' * H(:,:,i) * w_j);
                    end
                end
                SINRs(i) = sig / (int + sigma2);
            end

            % 检查是否所有用户满足SINR >= gamma
            if all(SINRs >= gamma - 1e-6)
                total_power = sum(sum(abs(W_rand).^2,1));
                if total_power < best_rand_power
                    best_rand_power = total_power;
                end
            end
        end

        if isinf(best_rand_power)
            continue;
        end;

        power_sum_sdp = power_sum_sdp + obj;
        power_sum_rand = power_sum_rand + best_rand_power; % 20个随机信道功率的累加
        valid_count = valid_count + 1;
    end

    if valid_count > 0
        avg_power_sdp(g_idx) = power_sum_sdp / valid_count;
        avg_power_rand(g_idx) = power_sum_rand / valid_count;
        fprintf('γ = %.2f: 有效样本=%d, SDP下界=%.4f, 随机化上界=%.4f\n', ...
                gamma, valid_count, avg_power_sdp(g_idx), avg_power_rand(g_idx));
    else
        avg_power_sdp(g_idx) = NaN;
        avg_power_rand(g_idx) = NaN;
        fprintf('y = %.2f：无可行样本！\n',gamma);
    end
end

% ==================== 绘图 ====================
figure;
plot(gamma_vec, avg_power_sdp, 'b-o', 'LineWidth', 2, 'DisplayName', 'SDP 下界 (松弛)');
hold on;
plot(gamma_vec, avg_power_rand, 'r-s', 'LineWidth', 2, 'DisplayName', '随机化上界 (可行解)');
hold off;
xlabel('SINR 门限 \gamma (线性值)');
ylabel('平均最小发射功率');
title(['M=', num2str(M), ', K=', num2str(K),...
       ', 每个γ下信道数=', num2str(num_realizations), ', 随机化次数=', num2str(L)]);
legend('Location', 'best');
grid on;
```










