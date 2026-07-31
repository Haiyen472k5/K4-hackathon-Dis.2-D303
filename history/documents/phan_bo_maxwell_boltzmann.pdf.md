# TÀI LIỆU: Phan_bo_Maxwell_Boltzmann.pdf

- **Thời gian lưu:** 11:30:50 31/7/2026
- **File gốc lưu tại:** `history/documents/files/Phan_bo_Maxwell_Boltzmann.pdf`
- **URL đính kèm gốc:** https://cdn.discordapp.com/attachments/1532309198153580605/1532313136118501386/Phan_bo_Maxwell_Boltzmann.pdf?ex=6a6d0e10&is=6a6bbc90&hm=20012ab7622f0df1ef2f5d832ae873cb6b3992a385cf698f2fba2033f7cf48a7&

## TÓM TẮT Ý CHÍNH (AI SUMMARY)
Tải lên bởi thidinh_hw trong kênh #tài-nguyên

## TOÀN BỘ NỘI DUNG CHI TIẾT TRÍCH XUẤT
```text
Phân bố Maxwell Boltzmann
Ban chuyên môn Vật lý−The Gifted Battlefield
Xuất bản vào Ngày 6 tháng 8 năm 2022
I.  Một số kiến thức liên quan
Xét một hệ vĩ mô, giả thiết có đại lượngxnào đó đặc trưng cho hệ có các giá trị rời
rạc:
x
1
,x
2
,x
3
,...,x
n
Ta thực hiệnNrất lớn phép đo đại lượngxtrên hệ. Giả sử chúng ta thực hiện được
N
1
phép đo cho giá trịx
1
,N
2
phép đo cho giá trịx
2
,...,N
i
phép đo cho giá trịx
i
. Đại
lượng
N
i
N
được gọi là tần số tỷ đối xuất hiện giá trịx
i
, còn giới hạn của tỷ số này khi N
tiến tới rất lớn là:
P
i
=   lim
N→+∞
N
i
N
Ta cho giới hạn này bằngP
i
.P
i
được gọi là xác suất tìm thấy giá trịx
i
. VìΣN
i
=N
nênΣP
i
= Σ
N
i
N
= 1, và đây là tổng các xác suất của tất cả các kết quả của phép đo,
cho giá trị bằng 1.
Ngoài ra ta có định lý cộng xác suất. Xác suất xuất hiện các giá trị của 1 đại lượng
thì bằng tổng các xác suất xuất hiện của từng giá trị riêng rẽ. Giả sử có xác suất xuât
hiện giá trịx
m
làP
m
, xác suất xuất hiện giá trịx
n
làP
n
. Vậy xác suất để xuất hiện cả
2 giá trị là:
P
mn
=
N
m
+N
n
N
=
N
m
N
+
N
n
N
=P
m
+P
n
Ta còn đi đến định lý nhân xác suất, theo định lý này thì xác suất xuất hiện đồng
thời các sự kiện độc lập thống kê bằng tích các xác suất của các sự kiện đó. Giả thiết ta
có 2 đại lượng A và B độc lập với nhau đều đặc trưng cho hệ vĩ mô đó. Ta đo lần lượt

các đại lượng A và B, thì ta đo được giá trịA
x
của đại lượng A với xác suất làP(A
x
),
B
y
của đại lượng B với xác suấtP(B
y
). Vậy xác suất của phép đo duy nhất mà cho được
đồng thời cả 2 giá trị là:
P(A
x
,B
y
) =P(A
x
)·P(B
y
)
Khi biết đến khái niệm xác suất xuất hiện của các giá trị, ta có thể tìm được giá trị
trung bình của đại lượng đó. Ta có giá trị trung bình:
x=
N
1
x
1
+N
2
x
2
+....+N
n
x
n
N
=
ΣN
i
x
i
N
= Σx
i
P
i
Bây giờ ta mở rộng cho đại lượng x nhận các giá trị không phải rời rạc và hữu hạn,
mà thay vào đó là liên tục và mở rộng đến vô cùng.Khi đó xuất hiện khái niệm hàm
phân bố mật độ xác suất. Hàm này cho phép chúng ta biết được phân bố của xác suất
tìm được các giá trị trong các vùng khả dĩ khác nhau . Nếu giá trị nằm trong khoảngx
đếnx+a, thì xác suất là∆P=f(x)a. Nếua→0thìdP
x
=f(x)dx, tức xác suất xuất
hiện giá trị trong khoảng từxđếnx+dx.
Nếu lấy tích phândP=f(x)dxtrên miền khả dĩ, thì ta gọi đây là Điều kiện chuẩn
hóa. Ta có:
Z
dP
x
=
Z
f(x)dx= 1
Ngoài ra, biết được hàm phân bố cho phép tính được giá trị trung bình của đại lượng
x:
x=
R
xdN
N
=
Z
xdP=
Z
xf(x)dx
Vậy tổng quát, ta có thể tính được giá trị trung bình của 1 hàm g(x)
g(x) =
R
g(x)dN
N
=
Z
xdP=
Z
g(x)f(x)dx
II.  Cơ sở thiết lập và chứng minh hàm phân bố
Maxwell
1.  Phân bố Maxwell
Nếu các phân tử khí chuyển động chỉ theo một phương thìdN=α.N.e
−μ.v
2
2RT
dv

Xác suất để phân tử có tốc độv→v+dvlà
dP=
dN
N
=α.e
−μ.v
2
2RT
dv
Trên thực tế thì các phân tử chuyển động hỗn độn, nên ta có

















dP
x
=dp
v
x
→v
x
+dv
x
=α.e
−μ.v
2
2RT
dv
dP
y
=dp
v
y
→v
y
+dv
y
=α.e
−μ.v
2
2RT
dv
dP
z
=dp
v
z
→v
z
+dv
z
=α.e
−μ.v
2
2RT
dv
⇒dP
⃗v→⃗v+d⃗v
=dP
x
.dP
y
.dP
z
=α
3
.e
−μ.(v
2
x
+v
2
y
+v
2
z
)
2RT
.dv
x
.dv
y
.dv
z
⇔dP
⃗v→⃗v+d⃗v
=α
3
.e
−μ.v
2
2RT
.dV
⃗v
vớidV
⃗v
là thể tích vi phân trong không gian vận tốc.
Do tính bình đẳng của các phương chuyển động nên
dP
⃗v→⃗v+d⃗v
=
dΩ
4π
.dP
v→v+dv
⇒α
3
.e
−μ.v
2
2RT
.dV
⃗v
=
dΩ
4π
.dP
v→v+dv
Xét trong hệ tọa độ cầu:



dΩ =
dS
v
v
2
=
v
2
.sinθ.dθ.dφ
v
2
= sinθ.dθ.dφ
dV
⃗v
=v
2
sinθ.dθ.dφ.dv
Từ đó suy ra
α
3
.e
−μ.v
2
2RT
.v
2
sinθ.dθ.dφ.dv=
sinθ.dθ.dφ
4π
.dp
v→v+dv
⇒







dP
v→v+dv
= 4πα
3
.e
−μ.v
2
2RT
.v
2
.dv=f(v).dv
dP
⃗v→⃗v+d⃗v
=
dP
v
4π
sinθ.dθ.dφ=
f(v)dv
4π
sinθ.dθ.dφ

vớif(v) = 4πα
3
.e
−μ.v
2
2RT
.v
2
2.  Các tích phân Poisson
1)
R
∞
0
x
2n
e
−β.x
2
dx= (−1)
n
d
n
dβ
n
 
1
2
r
π
β
!
2)
R
∞
0
x
2n+1
e
−β.x
2
dx= (−1)
n
d
n
dβ
n
 
1
2β
!
3.  Tìm hệ sốα
Vì số hạt bảo toàn nên ta có
1 =
Z
∞
0
dP
v
= 4πα
3
Z
∞
0
v
2
e
−μ.v
2
2RT
dv
Theo công thức (1) trong phần "Các tích phân Poisson", vớiβ=
μ
2RT
,n= 1ta thấy
Z
∞
0
v
2
.1e
−β.v
2
dv= (−1)
1
d
dβ
 
1
2
r
π
β
!
=
1
4
√
π
β
3/2
Suy ra
1 = 4πα
3
Z
∞
0
v
2
e
−μ.v
2
2RT
dv=α
3
 
π.2RT
μ
!
3/2
⇒α=
r
μ
2πRT
4.  Công thức phân bố Maxwell
Vậy xác suất để 1 phân tử có tốc độv→v+dvlà:
dP
v→v+dv
= 4π.
 
d
μ
2πRT
!
3/2
.e
−μ.v
2
2RT
.v
2
.dv=f(v).dv
Xác suất để 1 phân tử có vận tốc⃗v→⃗v+d⃗vlà:
dP
⃗v→⃗v+d⃗v
=
dP
v
4π
sinθ.dθ.dφ=
f(v)dv
4π
sinθ.dθ.dφ

III.  Tính toán các vận tốc
1.  Vận tốc có xác suất lớn nhất
Ta cóf(v) =f(v)
max
khi
df(v)
dv
= 0
⇔
d

4πv
2
(
μ
2πRT
)
3
2
e
−
μ
2RT
v
2

dv
= 0
⇔4π

μ
2πRT

3
2

2ve
−
μ
2RT
v
2
+v
2
e
−
μ
2RT
v
2
(−
μ
2RT
)2v

= 0
⇔−8π

μ
2πRT

3
2
ve
−
μ
2RT
v
2

μv
2
2RT
−1

= 0
⇔
μv
2
2RT
−1 = 0
⇒v=v
xs
=
s
2RT
μ
2.  Vận tốc trung bình
Vận tốc trung bình được định nghĩa như sau
v=
v
1
+v
2
+...+v
n
N
Theo cách tính giá trị trung bình của 1 hàmg(x)ở trên, ta viết lại vận tốc trung
bình như sau
v=
Z
∞
0
vf(v)dv
⇒v= 4π

μ
2πRT

3
2
Z
∞
0
v
3
e
−
μv
2
2RT
dv

Ta lại có công thức tích phân bất định
Z
∞
0
x
3
e
−ax
2
=
1
2a
2
Áp dụng công thức tích phân bất định trên, ta được
v= 4π

μ
2πRT

3
2
2

RT
μ

2
⇔v=
s
8RT
πμ
3.  Vận tốc căn quân phương
Trung bình cộng của các vận tốc bình phương được tính như sau
v
2
=
v
2
1
+v
2
2
+....+v
2
n
N
Theo cách tính giá trị trung bình của 1 hàmg(x), ta viết lại trung bình cộng của vận
tốc bình phương như sau
v
2
=
Z
∞
0
v
2
f(v)dv
⇒v
2
= 4π

μ
2πRT

3
2
Z
∞
0
v
4
e
−
μv
2
2RT
dv
Ta cũng có công thức tích phân bất định như sau
Z
∞
0
=x
4
e
−ax
dx=
3
8
r
π
a
5
Áp dụng công thức trên, ta được
v
2
= 4π

μ
2πRT

3
2
3
8
v
u
u
u
t
π

μ
2RT

5

⇔v
2
=
3RT
μ
Vận tốc này được gọi là vận tốc quân phương và nếu ta lấy căn của nó, ta sẽ được
vận tốc căn quân phương là
p
v
2
=
s
3RT
μ
IV.  Số va chạm trung bình
θ
⃗v
dS
Xét một mặtdSmà các hạt va chạm. Xét hình trụ có đáydS.cosθvà chiều caovdt.
Số hạt va chạm vớidSnằm trong hình trụ đang xét làdN. Đồng thời, các hạt này cần
phải tuân theo phân bố Maxwell vớivnằm trongv→v+dv,θnằm trongθ→θ+dθ,
φnằm trongφ→φ+dφ. Vì vậy, số hạt va chạm được tính như sau
dN=ndScosθvdtdP
⇒dN=ndScosθvdt
f(v)dv
4π
sinθdθdφ
⇒N=ndSdt
Z
∞
0
vf(v)dv
Z
π
2
0
sinθcosθdθ
Z
2π
0
dφ
⇒N=
n
4
dSdtv
Gọizlà số va chạm trung bình trên 1 đơn vị diện tích trong 1 đơn vị thời gian, ta có
z=
n
4
v=
n
4
s
8RT
μπ

V.  Quãng đường tự do trung bình
Xét một phân tử riêng lẻ. Khi phân tử đó chuyển động thì nó đã quét được một
thể tíchVtrong không gian. Thể tíchVấy là một hình trụ có đáy có đường kính bằng
đường kínhdcủa phân tử đó. Điều tương tự cũng sẽ xảy ra với các phân tử khác.
Xét một hình trụ thể tích bất kì của một hạt, ta sẽ có các hạt va chạm nhau nếu các
hạt còn lại nằm ở vị trí mà tâm của hạt đó cách trục hình trụ đang xét một khoảng bé
hơn hoặc bằng đường kínhd. Vậy ta nói, rằng tất cả các hạt đến va chạm nằm trong
không gian giới hạn bởi 1 mặt trụ đồng trục với trụ trong có bán kính tối đa bằng đường
kính phân tử.
d
d
Khi này, ta chỉ xét một phân tử, và coi như các phân tử khác đứng yên. Vận tốc
tương đối của phân tử đang xét so với với các phân tử khác lúc này được tính bằng công
thức cộng vận tốc, và lấy trung bình ta sẽ được
v
tb
=v
√
2n
0
πd
2
Số phân tử mà phân tử đang xét va chạm trong quãng thời giantlà
I=n
0
πd
2
v
tb
t
Trong khoảng thời giantđó, phân tử cũng đi được một quãng đường tự do là
s=vt
Vậy quãng đường tự do trung bình là
λ=
s
I
=
1
√
2n
0
πd
2
Từ tính toán trên, ta thấy quãng đường tự do trung bình là quãng đường mà hạt tự
do di chuyển giữa hai lần va chạm liên tiếp.

VI.  Áp suất lên thành bình
1.  Góc nhìn vĩ mô và vi mô
Khi chất khí, hay rộng hơn là chất lưu, đang chuyển động thành dòng, ta vẫn có thể
định nghĩa áp suất tại mọi điểm nhưng lực tác dụng lên một phần tử diện tích có thể
có một thành phần tiếp tuyến liên quan đến độ nhớt của chất khí (chất lưu) và sẽ gây
ra những phức tạp không cần thiết trong quá trình khảo sát. Chính vì vây, trong phần
này, chúng ta sẽ chỉ xét đến áp suất của một chất khí (chất lưu) đang đứng yên hoặc
đang chuyển động rất chậm.
Như chúng ta đã biết, áp lực tác dụng bởi một chất khí đứng yên được đặc trưng bởi
một đại lượng vô hướng là áp suất, được định nghĩa tại mọi điểm theo mức độ trung mô
bởi biểu thức
d
−→
f=pd
−→
S=pdS.
−→
n
Trong đó:





plà áp suất tại điểm đang xét.
dSlà diện tích của một phần tử bề mặt.
−→
nlà vector đơn vị pháp tuyến.
Tuy nhiên, khi quan sát dưới góc độ vi mô, ta có thể giải thích lại áp lực tác dụng
của một chất khí lên một thành bình là do tổng các lực tác dụng bởi các phân tử, gồm
hai lực sau:
- Các lực đẩy: có tầm rất ngắn, chỉ tác dụng khi các phân tử khí va chạm lên thành
bình. Thành phần đóng góp vào áp suất chung này được gọi làáp suất động học. Do tác
dụng của chúng lên thành làlực đẩy, áp suất động học này là dương.
- Các lực hút: có tầm trung bình, giữa các phân tử của chất khí và các phân tử của
thành bình. Thành phần này được gọi làáp suất phân tử. Do đặc điểmhútcủa thành
phần này, áp suất phân tử là âm.
Áp suất tổng cộng bằng tổng của hai số hạng đó
p=p
động học
+p
phân tử
Tuy nhiên, do ta chỉ xét đến khí lý tưởng trong phần này, nói cách khác là bỏ qua
lực hút giữa các phân tử và coi chúng chỉ tương tác với nhau qua các va chạm đàn hồi
nên áp suất toàn phần chỉ còn áp suất động học.
2.  Áp suất chất khí
Trong phần này, ta sẽ coi các phân tử khí là những chất điểm. Nói cách khác, với
khí đơn nguyên tử, ta sẽ nghiên cứu tác động của các chuyển động của nguyên tử lên

áp suất trên thành bình. Với khí đa nguyên tử, ta chỉ nghiên cứu tác động của chuyển
động tịnh tiến của khối tâm phân tử. Giả thiết này là phù hợp do sự khác biệt giữa hai
loại khí này về mặt động lực học là không đáng kể.
Ta xét một khối khí lý tưởng ở nhiệt độ tuyệt đốiT, nằm trong một bình chứa hình
trụ có diện tích đáySvà chiều caod, mang N hạt. Mỗi phân tử khí đều được coi là chất
điểm có khối lượng là m, chuyển động hỗn loạn và va chạm hoàn toàn đàn hồi với nhau
và với thành bình.
Hạt trước
va chạm
Hạt sau
va chạm
x
y
z
d
S
−→
v
x
Khi các phân tử khí va chạm với nhau, vì va chạm là đàn hồi xuyên tâm nên chúng
sẽ đổi vận tốc cho nhau và sẽ tiếp tục chuyển động. Từ đó ta thấy rằng sẽ không có sự
khác biệt nào nếu ta tạm thời bỏ qua các va chạm đó, hay coi như các phân tử khí đi
xuyên qua nhau, và chỉ xét đến va chạm đàn hồi giữa chúng với thành bình.
Khi phân tử khí va chạm với thành bình, chỉ có thành phần vận tốc theo phương x
của hạt là bị thay đổi, nói cách khác là chỉ có thành phần động lượng theo phương x của
hạt bị thay đổi một lượng là
∆P
x
= 2mv
x
Ta nhận thấy rằng thành bình nhận được một động lượng là−2mv
x
từ phân tử khí
trong quá trình va chạm. Bên cạnh đó, các hạt phân tử sẽ va chạm với thành bình liên
tục với thời gian∆tgiữa các lần va chạm của cùng một hạt là thời gian hạt đó chuyển
động với vận tốcv
x
tới thành bình kia và trờ lại:
∆t=
2d
v
x
Lưu ý rằng kết quả này vẫn giữ nguyên kể cả khi hạt phân tử va chạm với bất kì
thành bình nào khác trên đường chuyển động vì các thành ấy đều song song với phương
x nên không làm thay đổi thành phầnv
x
. Từ đó ta có tốc độ trung bình mà động lượng

của một hạt được truyền cho thành bình là
∆P
∆t
= 2mv
x
v
x
2d
=
mv
x
2
d
Theo định luật II Newton tổng quát, đây cũng chính là lực do một hạt tác dụng lên
thành bình
F=
∆P
∆t
=
mv
x
2
d
Để tìm lực tổng hợp, ta phải cộng thêm lực do các hạt khác tác dụng lên thành bình,
và vì chúng có những vận tốc khác nhau nên biểu thức lực tổng hợp sẽ có dạng
F=
m
d
(v
x1
2
+v
x2
2
+...+v
xN
2
)(1)
Mặt khác, ta có tốc độ quân phương trên phương x là
v
x
2
=
v
x1
2
+v
x2
2
+...+v
xN
2
N
(2)
Đối với mọi phân tử thìv
2
=v
x
2
+v
y
2
+v
z
2
. Vì do có rất nhiều phân tử và chúng
đều chuyển động theo những hướng ngẫu nhiên nên tốc độ quân phương trên ba phương
x, y, z là bằng nhau
v
2
=v
x
2
+v
y
2
+v
z
2
= 3v
x
2
(3)
Kết hợp (2), (3) vào (1) ta được
F=
Nmv
2
3d
Suy ra được áp suất lên thành bình là
p=
F
S
=
Nm
v
2
3dS
=
Nm
v
2
3V
=
1
3
nm
v
2
với n là mật độ hạt.
Thông thường, ở mức độ vĩ mô, chúng ta thường tính số mol (ν) thay cho số phân
tử và nhiệt độ tuyệt đối của chất khí thay cho tốc độ quân phương. Nên nếu ta thay giá
trị đã được tính ở phần III của vận tốc quân phương vào biểu thức trên thì ta được
p=
Nm
3V
3RT
μ

⇔pV=
M
μ
RT
⇔pV=νRT
Và đây cũng chính là phương trình Clapeyron-Mendeleev.
Một cách chứng minh khác sử dụng công thức số va chạm trung bình. Ta xét lại các
điều kiện của phần tính số va chạm trung bình: hình trụ có đáydS.cosθvà chiều cao
vdt. Số hạt va chạm vớidSnằm trong hình trụ đang xét làdNvà tuân theo phân bố
Maxwell vớivnằm trongv→v+dv,θnằm trongθ→θ+dθ,φnằm trongφ→φ+dφ.
Ta có số hạt va chạm vào thành bình là
dN=ndScosθvdt
f(v)dv
4π
sinθdθdφ
Bên cạnh đó, ta có lực do một phân tử tác dụng lên thành bình khi va chạm tuân
theo định luật II Newton tổng quát
F=
dP
dt
=
2mvcosθ
dt
Với dN phân tử thì
dF=
2mvcosθ
dt
dN
= 2mvcosθndScosθv
f(v)dv
4π
sinθdθdφ
= 2m(
m
2πkT
)
3/2
.ndS.v
4
e
−
mv
2
2kT
dv.sinθcos
2
θdθ.dφ
⇒F= 2m(
m
2πkT
)
3/2
.ndS.
Z
∞
0
v
4
e
−
mv
2
2kT
dv.
Z
π/2
0
sinθcos
2
θdθ
Z
2π
0
dφ
= 2m(
m
2πkT
)
3/2
.ndS.
3
8
s
π
(
m
2kT
)
5
.
1
3
.2π
=nkTdS
⇒p=nkT=
1
3
nmv
2

Như vậy, một đại lượng duy nhất (áp suất) nối liền với một đại lượng thống kê (vận
tốc quân phương) cho phép ta xác định các ảnh hưởng cơ học tác dụng bởi chất khí lên
thành bình mà không cần thiết phải biết trạng thái cơ học của mọi phân tử của chất
khí. Hệ thức tìm được dựa trên giả thuyết về sự đẳng hướng của các vận tốc. Giả thuyết
này chỉ đúng tại mọi thời điểm (và không chỉ tính trung bình) nếu các thăng giáng là
không đáng kể, nói cách khác là hệ khí nghiên cứu chứa một số đủ lớn phân tử.
VII.  Động năng tịnh tiến của phân tử
1.  Tiếp cận bằng hàm phân bố Maxwell
Một trong những cách phổ biến nhất để tính động năng tịnh tiến trung bình của một
phân tử là sử dụng hàm phân bố Maxwell đã được giới thiệu ở trên:
f(v) =
dN
N.dv
= 4π(
m
2πkT
)
3/2
v
2
exp (−
mv
2
2kT
)
Xét một khối khí lý tưởng có N phân tử, với phân tử 1 có động năngK
1
, phân tử 2
có động năngK
2
, ..., phân tử N có động năngK
N
. Trong đó, códN
1
phân tử có động
năngK
1
,dN
2
phân tử có động năngK
2
, ...,dN
k
phân tử có động năngK
k
(k < N). Ta
có động năng tịnh tiến trung bình là
K=
K
1
+K
2
+...+K
N
N
=
K
1
.dN
1
+K
2
.dN
2
+...+K
K
.dN
k
N
=
P
K.dN
N
Ta đã biết động năng của một phân tử có khối lượng m vận tốcvlàK=
1
2
mv
2
, từ
đó suy ra được







v=
r
2K
m
dv=
dK
√
2mK
Thay hai biểu thức trên vào hàm MB, ta tính được số phân tử có động năngKlà
dN= 4Nπ(
m
2πkT
)
3/2
2K
m
exp (−
K
kT
)
dK
√
2mK

Từ đó, ta sẽ có động năng tịnh tiến trung bình của phân tử là
K=
P
K.dN
N
=
X
4π(
m
2πkT
)
3/2
2K
2
m
exp (−
K
kT
)
dK
√
2mK
=
2π
(πkT)
3/2
Z
∞
0
K
3/2
exp (−
K
kT
)dK
=
2π
(πkT)
3/2
.
3
4
√
π(kT)
5/2
=
3
2
kT
Cách làm này có thể khá khó hiểu đối với một số bạn nếu bạn không biết cách tính
tích phân bất định
R
∞
0
x
3/2
e
−ax
dx=
3
√
π
4a
5/2
. Để đơn giản hơn, ta có thể viết lại biểu thức
động năng tịnh tiến trung bình là
K=
K
1
+K
2
+...+K
N
N
=
m
2
.
v
1
2
+v
2
2
+...+v
N
2
N
=
m
2
v
2
=
μ
2N
A
.
3RT
μ
=
3
2
kT
2.  Tiếp cận bằng tính chất đẳng hướng
Trong phần này, ta sẽ xét một phân tử khí của một khí lý tưởng, nhưng tốc độ của
nó lúc này sẽ thay đổi khi nó va chạm với một phân tử khí khác. Giả sử rằng tốc độ
trung bình của phân tử đang xét bằng với tốc độ trung bình của mọi phân tử khí tại
mọi thời điểm (giả định này là phù hợp khi năng lượng của khối khí không thay đổi và
ta quan sát phân tử này đủ lâu).
Ta đã biết động năng chuyển động nhiệt của một hạt có tốc độvtại một thời điểm
bất kì làK=
1
2
mv
2
, nên động năng trung bình của chuyển động tịnh tiến vì nhiệt của

phân tử trong khoảng thời gian quan sát là
K=K
trung bình
= (
1
2
mv
2
)
trung bình
=
1
2
m(v
2
)
trung bình
=
1
2
mv
2
Từ phần trên ta đã cóp=
1
3
nmv
2
. Kết hợp biểu thức này với biểu thức động năng
tịnh tiến trung bình ở trên, ta sẽ được phương trình động lực học phân tử khí lý tưởng
p=
2
3
nK
So sánh biểu thức trên với biểu thức cơ bảnp=Tnk, ta nhận thấy có một mối liên
hệ giữa động năng tịnh tiến trung bình của phân tử khí với nhiệt độ tuyệt đối của khối
khí đó
K=
3
2
kT
Thừa số 3 trong biểu thức trên xuất hiện là vì sự tương đương của ba phương không
gian hay sự tương đương của trung bình các thành phần vận tốc bình phương:
v
2
=v
x
2
+v
y
2
+v
z
2
= 3v
x
2
Do đó ta có thể viết
1
2
m
v
x
2
=
1
2
m
v
y
2
=
1
2
m
v
z
2
=
1
2
kT
Tổng của ba đóng góp bằng nhau này cho ta phương trình liên hệ giữa động năng
tịnh tiến trung bình với nhiệt độ tuyệt đối trên.
Thừa số 3 được nối kết với ba bậc tự do tịnh tiến của phân tử đơn nguyên tử. Đối
với các mục đích của chúng ta, mỗi bậc tự do tương ứng với khả năng phân tử tham gia
vào chuyển động một chiều để có đóng góp vào cơ năng của phân tử này. Còn đối với
phân tử đa nguyên tử thì bên cạnh chuyển động tịnh tiến của khối tâm còn có những
dạng chuyển động khác như chuyển động quay của phân tử, chuyển động dao động của
các nguyên tử trong phân tử cũng đóng góp phần năng lượng của mình vào cơ năng của
phân tử. Dựa vào trên quan niệm về chuyển động hỗn loạn không có phương ưu tiên,
không có một loại chuyển động ưu tiên nào, James Clerk Maxwell đã mở rộng kết quả
của chuyển động tịnh tiến và thiết lập định luật phân bố đều năng lượng cho các bậc tự
do:
Cơ năng trung bình của phân tử được phân bố đều cho các bậc tự do,
năng lượng ứng với một bậc tự do bằng
1
2
kT.

Nếu phân tử cóibậc tự do thì cơ năng trung bình của phân tử là
E=i(
1
2
kT)
Bên cạnh đó, từ công thức động năng trên, ta có thể rút ra một kết luận: tại một
nhiệt độ T, mọi phân tử khí trong khí lý tưởng, bất kể khối lượng của chúng là gì, đều
sẽ có cùng một động năng trung bình của chuyển động nhiệt là
3
2
kT. Khi ta đo nhiệt độ
của một khối khí, ta cũng đang đo động năng trung bình của các phân tử của nó.
Đồng thời, động năng trung bình của phân tử cũng cho ta biết giới hạn dưới của độ
chính xác của phép đo. Theo công thức trên thì một hạt bất kì tham gia chuyển động
nhiệt không thể đứng yên ở một vị trí cân bằng. Ví dụ như khi ta treo một vật nặng ở
đầu dưới một sợi dây thì, theo quy luật của Tĩnh học, vật sẽ cân bằng ở vị trí mà dây
treo trùng với đường thẳng đứng đi qua trọng tâm của vật. Vật tham gia chuyển động
nhiệt vì các phân tử tạo nên vật chuyển động hỗn loạn và các phân tử của không khí,
của dây treo va chạm vào vật trong chuyển động nhiệt. Vật nặng cũng có động năng
trung bình là
3
2
kT. Động năng này là động năng chuyển động tịnh tiến của vật trong
không gian ba chiều (ứng với ba bậc tự do). Vì động năng này nên vật luôn luôn dao
động về mọi phía trên mặt phẳng nằm ngang và không đứng yên ở vị trí cân bằng. Động
năng dao động theo một hướng xác định (ứng với một bậc tự do) là
1
2
kTtheo định luật
phân bố đều năng lượng cho các bậc tự do. Biên độ căn quân phương của dao động của
vật nặng có thể tính được là rất nhỏ và có thể bỏ qua. Tuy vậy, nếu thực hiện phép đo
tọa độ của vật rắn nói trên một cách thật chính xác thì rõ ràng sai số của phép đo phải
lớn hơn biên độ căn quân phương của dao động. Dù máy móc có tinh xảo đến đâu thì
độ chính xác cũng không thể nhỏ hơn biên độ đó. Suy rộng ra, mọi phép đo của Vật Lý
đều có một giới hạn dưới của độ chính xác. Giới hạn này tồn tại vì có chuyển động nhiệt
của các phân tử tạo thành mọi vật. Ta có thể cảm nhận trực tiếp điều này khi nghe âm
thanh được xử lí (phóng đại, truyền, ghi) bằng các dụng cụ điện tử. Khi không có âm
thanh ngoài đưa vào, máy vẫn có tiếng rì rào nho nhỏ (gọi là phông hay tiếng ồn), máy
càng tốt thì tiếng rì rào này càng nhỏ nhưng không thể loại trừ hết được. Nếu đưa một
âm thanh ngoài vào máy mà khi ra âm thanh nhỏ hơn tiếng rì rào thì không thể nhận
biết (nghe) được âm thanh này.
VIII.  Cơ sở thiết lập phân bố Maxwell - Boltzmann
Nhà vật lý học James Clerk Maxwell đã thiết lập nên hàm phân bố Maxwell để miêu
tả sự phân bố vận tốc của các hạt trong khối khí lý tưởng vào những năm 1960. Sau

đó, nhà vật lý học Ludwig Boltzmann đã mở rộng và khái quát hàm phân bố Maxwell
để miêu tả sự phân bố và xác suất tìm thấy các hạt có vận tốcvtrong không gian 3
chiều và trong trường trọng lực. Phân bố Maxwell-Boltzmann cung cấp một giải thích
đơn giản về nhiều đặc tính cơ bản của khí, bao gồm áp suất và sự khuếch tán. Vậy ta
hãy tìm hiểu xem phân bố Maxwell-Boltzmann là gì nào.
1.  Phân bố Boltzmann
Ta xét một khối khí lý tưởng mà trong đó các phân tử có cùng thế năng được đặt
trong trọng trường của Trái Đất. Vì có trọng lực tác dụng lên các phân tử dẫn đến áp
suất của chất khí không đồng đều: càng xuống thấp thì áp suất càng cao, do lớp không
khí ở dưới phải chịu trọng lượng của lớp trên. Vậy có thể xem áp suất khí là một hàm
theo độ cao. Tìm ra quy luật biến thiên của hàm này chính là công thức phong vũ biểu:
Xét cột khí có khối lượngM, diện tích đáyS, nằm giữa hai điểm có độ caohvà
h+dhso với gốc thế năng, với áp suất ở hai độ cao đó lần lượt làpvàp+dp.
Ta có độ chênh lệch áp suất này sinh ra một áp lực cân bằng với trọng lực
Sdp=−Mg
⇔M=−
Sdp
g
Theo phương trình Claypeyron - Mendeleev
pV=
M
μ
RT
⇒pV=−
Sdp
μg
RT
⇔pSdh=−
Sdp
μg
RT
⇔
dp
p
=−
μg
RT
dh
⇒
Z
p
p
0
dp
p
=−
μg
RT
Z
h
h
0
dh
Vớip
0
là áp suất tạih
0
= 0
⇒ln
p
p
0
=−
μgh
RT

⇒p=p
0
e
−
μgh
RT
=p
0
e
−
mgh
kT
Trong đó:
•p: Áp suất khí tại độ caoh
•p
0
: Áp suất khí tại mặt đất
•μ: Khối lượng mol của khí
•m: Khối lượng một phân tử khí
•T: Nhiệt độ tuyệt đối của khí
Đây được gọi là công thức phong vũ biểu. Nó cho thấy áp suất khối khí lý tưởng
giảm khi lên cao theo quy luật hàm mũ.
Nếu nhiệt độ tại mọi điểm trong khối khí là như nhau thì mật độ phân tửncủa khối
khí tỉ lệ với áp suấtp
(
p=nkT
p
0
=n
0
kT
⇒n=n
0
e
−
mgh
kT
Công thức này thể hiện sự thay đổi mật độ phân tử theo độ cao. Mặt khác, thế năng
của phân tử trong trọng trường tỉ lệ thuận với độ cao:U=mgh, do đó ta có
n=n
0
e
−
U
kT
Ta có số hạt tìm thấy trong thể tíchdVcó cùng thế năngUlàdN
dN=ndV
⇔dN=n
0
e
−
U
kT
·dx·dy·dz
Đây chính là công thứcphân bố Boltzmann. Không chỉ vậy, Boltzmann còn chứng
minh được công thức trên cũng có thể được dùng để tính sự phân bố hạt trong một
trường lực thế bất kì. Ta chỉ cần thaynvàn
0
thành mật độ hạt ở các vị trí lần lượt ứng
với thế năng bất kỳ và thế năng bằng 0.

2.  Phân bố Maxwell - Boltzmann
Xét số hạt tìm thấy trong thể tíchdV=dx·dy·dzcó thế năngUlà dN. Trong đó,
códN(v
x
,v
y
,v
z
,x,y,z)hạt có vận tốc trên ba phương (v
x
,v
y
,v
z
) tương ứng trên các dải
vận tốcdv
x
,dv
y
,dv
z
. Từ đó ta có
dN(v
x
,v
y
,v
z
,x,y,z) =dN·dP(v
x
,v
y
,v
z
)
Áp dùng công thức phân bố Boltzmann và công thức phân bố Maxwell, ta có
dN(v
x
,v
y
,v
z
,x,y,z) =n
0
e
−
U
kT
·dx·dy·dz·(
m
2πkT
)
3/2
e
−m(v
2
x
+v
2
y
+v
2
z
)
2kT
·dv
x
·dv
y
·dv
z
⇔dN(v
x
,v
y
,v
z
,x,y,z) =n
0
(
m
2πkT
)
3/2
e
−(K+U)
kT
·dx·dy·dz·dv
x
·dv
y
·dv
z
Từ đó, ta rút ra được hàm phân bố Maxwell-Boltzmann
F
MB
=n
0
·(
m
2πkT
)
3/2
·e
−E
kT
Lưu ý:Hàm phân bố Maxwell-Boltzmann chỉ được áp dụng cho khí lí tưởng. Trong
khí thực có nhiều hiệu ứng khác nhau tác động lên các hạt (ví dụ như dòng xoáy, tương
tác giữa các hạt,...) có thể làm cho tốc độ của chúng phân bố khác với kết quả của phân
bố Maxwell-Boltzmann. Tuy nhiên, khí bị làm loãng ở nhiệt độ bình thường hoạt động
gần giống như khí lí tưởng nên phân bố Maxwell-Boltzmann là một giá trị gần đúng cho
những khí như vậy.
IX.  Bài tập
Bài toán 1.
Giả thiết rằng năng lượng của một hạt trong một khối khí hình trụ nhiệt độ T có
thể được biểu diễn bằng biểu thứcE(z) =az
2
vớizlà tọa độ của hạt trên trụcOz(Oz
trùng với trục khối khí) vàzcó thể nhận mọi giá trị từ−∞tới+∞. Chứng tỏ rằng
năng lượng trung bình của mỗi hạt đối với một hệ gồm các hạt như trên tuân theo thống
kê Maxwell - Boltzmann sẽ là
E=
1
2
kT. Nhận xét mối quan hệ giữa định luật phân bố
đều năng lượng với các tính toán trên.

Bài toán 2.
Tính phần trăm phân tử khí có động năng chuyển động tịnh tiến khác với động năng
trung bình chuyển động tịnh tiến của các phân tử không quá1%.
Bài toán 3.
Tìm số phân tử khí Heli trong1cm
3
, có vận tốc nằm trong khoảng từ2,39km/sđến
2,41km/s. Nhiệt độ của Heli là690
◦
C, khối lượng riêng là2,16·10
−4
kg/m
3
.
Bài toán 4.
Tính số phần trăm phân tử khí nằm trong trọng trường của Trái Đất có thế năngε
p
lớn hơn động năng trung bình chuyển động tịnh tiến của chúng. Giả sử rằng nhiệt độ
của khí và gia tốc trọng trường không phụ thuộc vào độ cao.
Bài toán 5.
Một hốc cách nhiệt được nối với hai bình chứa khí lý tưởng đơn nguyên tử bằng các
lỗ thủng nhỏ giống nhau. Bình 1 được giữ ở áp suấtp
1
, nhiệt độT
1
và bình 2 được giữ ở
áp suấtp
2
, nhiệt độT
2
không đổi. Tìm biểu thức nhiệt độ và áp suất của khí trong hốc.
1
2
3
T
1
, p
1
T
2
, p
2

X.  Lời giải tham khảo
Bài toán 1.
GọiSlà diện tích đáy của khối khí. Theo phân bố Maxwell - Boltzmann, ta có hàm
phân bố củaE(z)là
dN=F(MB).dV.dV
v
=n
0
(
m
2πkT
)
3/2
exp (
−E
kT
).Sdz.dV
v
Đồng thời, ta cũng có năng lượng trung bình của mỗi hạt là
E=
R
EdN
R
dN
=
R
+∞
−∞
E.n
0
(
m
2πkT
)
3/2
exp (
−E
kT
).Sdz.
R
dV
v
R
+∞
−∞
n
0
(
m
2πkT
)
3/2
exp (
−E
kT
).Sdz.
R
dV
v
=
R
+∞
−∞
az
2
exp (−
az
2
kT
)dz
R
+∞
−∞
exp (−
az
2
kT
)dz
Mặt khác, ta cũng có các công thức tích phân bất định





R
+∞
0
x
2
e
−ax
2
dx=
1
4
r
π
a
3
R
+∞
0
e
−a
2
x
2
dx=
√
π
2a
Và vìx
2
e
−ax
2
vàe
−a
2
x
2
đều là hàm chẵn nên
(
R
+∞
−∞
x
2
e
−ax
2
dx= 2
R
+∞
0
x
2
e
−ax
2
dx
R
+∞
−∞
e
−a
2
x
2
dx= 2
R
+∞
0
e
−a
2
x
2
dx

Từ đó ta suy ra được
E=
R
+∞
0
az
2
exp (−
az
2
kT
)dz
R
+∞
0
exp (−
az
2
kT
)dz
=
a
4
r
π
a
3
(kT)
3
√
π
2
r
kT
a
=
1
2
kT
Nhận xét:Trong bài toán này, các hạt chỉ có một bậc tự do dọc theo trụcOznên
theo định luật phân bố đều năng lượng cho các bậc tự do, năng lượng trung bình của
mỗi hạt là
1
2
kT.
Bài toán 2.
Từ công thức phân bố MB và công thức động năng của chất điểm, ta đã chứng minh
được công thức số hạt có động năng K đến dK trong số N hạt là
∆N=
2Nπ
(πkT)
3/2
√
Kexp (−
K
kT
)∆K
⇒α=
∆N
N
=
2π
(πkT)
3/2
√
Kexp (−
K
kT
)∆K(1)
Vì ta cần tìm số hạt có động năng tịnh tiến sai khác không quá1%so với động năng
trung bình nên ta có
∆K= 1,01
K−0,99K= 0,02K(2)
Thay (2) vàK= 0,99
Kvào (1), ta được
α=
2π
(πkT)
3/2
q
0,99Kexp (−
0,99K
kT
)0,02K
=
2π
(πkT)
3/2
r
0,99.
3
2
kTexp (−
0,99.
3
2
kT
kT
).0,02.
3
2
kT
=
2
√
π
r
0,99.
3
2
exp (−0,99.
3
2
).0,02.
3
2
≈0,934%

Bài toán 3.
Ta lấy:dv= 2,41km/s−2,39km/s= 0,02km/s= 20m/s
Và:v=
2,41km/s+ 2,39km/s
2
= 2,40km/s
GọiNlà tổng số phân tử Heli,dNlà số phân tử Heli trong dải vận tốcv+dv
Xác suất tìm thấy hạt mang vận tốcvlà:
dN
Ndv
=f(v)
⇒
dN
N
=f(v)·dv=
4
√
π
(
m
2kT
)
3
2
v
2
e
−mv
2
2kT
dv
⇒dN=
4N
√
π
(
m
2kT
)
3
2
v
2
e
−mv
2
2kT
dv(1)
Mặt khác, ta có phương trình khí lý tưởng:
P=nkT
⇒P=
N
V
kT
⇔N=
PV
kT
(2)
Ta lại có phương trình Mendeleev - Claypeyron:
PV=
m
μ
RT
⇔P=
m
V μ
RT(3)
Thế (2)(3) vào (1), ta có:
⇒dN=
4mR
kμ
√
π
(
m
2kT
)
3
2
v
2
e
−mv
2
2kT
dv≈2,5·10
4
(phân tử Heli)
Bài toán 4.
Độ cao mà ở đó thế năng của các phân tử lớn hơn động năng trung bình của chuyển
động tịnh tiến của chúng:
mgh≥
3
2
kT

⇒h≥
3
2
kT
mg
(1)
Áp dụng công thức phân bố Boltzmann. Từ đó, ta có số phân tử khíN
h
có thế năng
lớn hơn động năng trung bình của chuyển động tịnh tiến:
N
h
=
Z
∞
h
ndV=
Z
∞
h
n
0
e
−mgh
kT
Sdh=n
0
S
Z
∞
h
e
−mgh
kT
dh
Áp dụng phép tích phân:
R
e
−ax
=
1
a
e
−ax
⇒N
h
=n
0
S
kT
mg
e
−mgh
kT
(2)
Tương tự, ta có tổng cộng số phân tử là:
N=
Z
∞
0
ndV=
Z
∞
0
n
0
e
−mgh
kT
Sdh=n
0
S
Z
∞
0
e
−mgh
kT
dh
⇒N=n
0
S
kT
mg
(3)
Từ (2), (3) ta có tỉ số phân tử khí nằm trong trọng trường Trái Đất có thế năng lớn
hơn động năng trung bình chuyển động tịnh tiến của chúng:
η=
N
h
N
=
n
0
S
kT
mg
e
−mgh
kT
n
0
S
kT
mg
=e
−mgh
kT
(4)
Thế (1) vào (4), ta có tỉ số phân tử khí nằm trong trọng trường Trái Đất có thế năng
lớn hơn động năng trung bình chuyển động tịnh tiến của chúng:
⇒η=exp(
−mg
3
2
kT
mg
kT
) =exp(−
3
2
)≈22,3%
Bài toán 5.
1
2
3
T
1
, p
1
, n
1
T
2
, p
2
, n
2
T
3
, p
3
, n
3

Gọin
1
,n
2
vàn
3
lần lượt là mật độ phân tử trong bình 1, bình 2 và hốc. Ta có





p
1
=n
1
kT
1
p
2
=n
2
kT
2
p
3
=n
3
kT
3
⇒





p
1
p
2
=
n
1
T
1
n
2
T
2
p
1
p
3
=
n
1
T
1
n
3
T
3
⇔





n
2
=
p
2
T
1
p
1
T
2
.n
1
p
3
=
n
3
T
3
n
1
T
1
p
1
(1)
Sau một khoảng thời gian đủ lâu, trạng thái cân bằng động giữa hai khối khí sẽ được
thiết lập. Khi đó, số phân tử khí đi từ bình 1 và 2 vào hốc và ngược lại là bằng nhau:
z
3
=z
1
+z
2
⇔
1
4
n
3
v
3
=
1
4
n
1
v
1
+
1
4
n
2
v
2
⇔n
3
s
8RT
3
μπ
=n
1
s
8RT
1
μπ
+n
2
s
8RT
2
μπ
⇔n
3
p
T
3
=n
1
p
T
1
+n
2
p
T
2
(2)
Thế biểu thức trên của (1) vào (2), ta được:
n
3
p
T
3
=n
1
(
p
T
1
+
p
2
T
1
p
1
T
2
p
T
2
)(3)
Mặt khác, do cân bằng nên nhiệt độ khối khí trong hốc được giữ không đổi, hay nội
năng khối khí không đổi. Từ đó, ta nhận thấy tổng động năng tịnh tiến trung bình của
các phân tử vào hốc bằng với tổng động năng của các phân tử ra khỏi hốc:
K
3
n
3
=K
1
n
1
+K
2
n
2
⇔
3
2
kT
3
n
3
p
T
3
=
3
2
kT
1
n
1
p
T
1
+
3
2
kT
2
n
2
p
T
2

⇔n
3
T
3
p
T
3
=n
1
T
1
(
p
T
1
+
p
2
p
1
p
T
2
)(4)
Lấy (4) chia cho (3), ta được:
T
3
=
T
1
√
T
1
+
p
2
T
1
p
1
√
T
2
√
T
1
+
p
2
T
1
p
1
T
2
√
T
2
(5)
Kết hợp biểu thức dưới của (1) với (4) và (5), ta được:
p
3
= (p
1
p
T
1
+p
2
p
T
2
)
v
u
u
u
u
u
t
√
T
1
+
p
2
T
1
p
1
T
2
√
T
2
T
1
√
T
1
+
p
2
T
1
p
1
√
T
2
Tài liệu tham khảo
[1] David Halliday – Robert Resnick – Jearl WalkerFundamentals of Physics
[2] Hugh D. Young - Roger A. FreedmanUniversity Physics with Modern Physics
[3] P.F.I.E.VNhiệt động học
[4] Yung-Kuo LimProblems and solutions on Thermodynamics and Statistical Mechanics
[5] N.A Krall - A.W TrivelpiecePrinciples of Plasma Physics
[6] Trần Ngọc Hợi - Phạm Văn ThiềuVật lý đại cương - Các nguyên lí và ứng dụng -
Tập 1
[7] Phạm Quý TưBồi dưỡng học sinh giỏi Vật lí Trung học phổ thông: Nhiệt học và Vật
lí phân tử
[8] Bùi Quang HânGiải toán vật lí 10 - Tập 2
```
