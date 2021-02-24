import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Animated, Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { default as Profiles, default as profiles } from "./data/profiles";

const { width, height } = Dimensions.get("screen");

const __Profile_Width__ = width * 0.75;
const __Profile_Height__ = __Profile_Width__;
const __Inner_Offset__ = 25;
const __Icon_Size__ = 36;
const __Content_Roundness__ = 10;
const __Content_Padding__ = 10;
const __Opacity_Factor__ = 0.3;
const __On_Off_Output_Range__ = [0, 1, 0];

const __Page_Background__ = "#FFF8DC";
const __Content_Background__ = "#F5FFFA";
const __Primary_Foreground__ = "#00C853";
const __Secondary_Foreground__ = "#AFAFAF";

const __Standard_Font_Size__ = 18;
const __Small_Font_Size__ = 12;
const __Standard_Line_Height__ = 24;

export default function App() {
	const renderItem = ({ index, item }) => {
		const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
		const outputRange = __On_Off_Output_Range__;
		const opacity = scrollX.interpolate({
			inputRange,
			outputRange,
		});
		const translateY = scrollX.interpolate({
			inputRange,
			outputRange: [50, 0, 50],
		});

		return (
			<Animated.View
				style={{
					width: width,
					paddingVertical: __Inner_Offset__,
					opacity,
					transform: [{ translateY }],
				}}
			>
				<Image
					source={{ uri: item.avatar }}
					style={{
						overflow: "hidden",
						borderWidth: 2,
						borderColor: __Secondary_Foreground__,
						width: __Profile_Width__,
						height: __Profile_Height__,
						resizeMode: "cover",
						borderRadius: __Content_Roundness__,
					}}
				/>
			</Animated.View>
		);
	};

	const listReference = React.useRef();
	const scrollX = React.useRef(new Animated.Value(0)).current;
	const flipToggle = Animated.modulo(Animated.divide(scrollX, width), width);
	const [currentProfileIndex, setCurrentProfileIndex] = React.useState(0);

	return (
		<View style={{ backgroundColor: __Page_Background__, flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<Animated.FlatList
					ref={listReference}
					horizontal
					pagingEnabled={true}
					contentContainerStyle={{ height: __Profile_Height__ + __Inner_Offset__ * 2, paddingHorizontal: __Inner_Offset__ * 2 }}
					bounces={true}
					style={{ flexGrow: 0 }}
					showsHorizontalScrollIndicator={false}
					data={profiles}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
					onMomentumScrollEnd={(event) => {
						setCurrentProfileIndex(Math.round(event.nativeEvent.contentOffset.x / width)); //calculate the active item index
					}}
				/>
				<View
					style={{
						width: __Profile_Width__,
						alignItems: "center",
						paddingHorizontal: __Inner_Offset__ * 2,
						marginLeft: __Inner_Offset__ * 2,
					}}
				>
					{Profiles.map((p, index) => {
						const inputRange = [(index - __Opacity_Factor__) * width, index * width, (index + __Opacity_Factor__) * width];
						const outputRange = __On_Off_Output_Range__;
						const opacity = scrollX.interpolate({
							inputRange,
							outputRange,
						});

						//pass the profile to the content control
						return (
							<Animated.View key={p.id} style={{ position: "absolute", opacity }}>
								<Content item={p} />
							</Animated.View>
						);
					})}
				</View>
				<View
					style={{
						width: __Profile_Width__ + __Inner_Offset__ * 2,
						position: "absolute",
						backgroundColor: __Content_Background__,
						borderRadius: __Content_Roundness__,
						backfaceVisibility: "true",
						zIndex: -999,
						top: __Inner_Offset__ * 2,
						left: __Inner_Offset__,
						bottom: 0,
						transform: [
							{
								perspective: __Profile_Width__ * 4,
							},
							{
								// rotateY: flipToggle.interpolate({
								// 	inputRange: [0, 0.5, 1],
								// 	outputRange: ["0deg", "90deg", "180deg"],
								// }),
								// this code has a irritating bug on Android - Invariant Violation: Transform with key of "rotateY" must be a string: {"rotateY":"0deg"}
								rotateY: getAngle(flipToggle),
							},
						],
					}}
				></View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: __Profile_Width__ + __Inner_Offset__ * 4,
						paddingHorizontal: __Inner_Offset__,
						paddingVertical: __Inner_Offset__ * 6,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							let setIndex = currentProfileIndex === 0 ? currentProfileIndex : currentProfileIndex - 1;
							setCurrentProfileIndex(setIndex);
							listReference?.current?.scrollToOffset({
								offset: setIndex * width,
								animated: true,
							});
						}}
						disabled={currentProfileIndex === 0}
						style={{ opacity: currentProfileIndex === 0 ? __Opacity_Factor__ : 1 }}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Ionicons name="arrow-back-circle-outline" size={__Icon_Size__} style={{ ...styles.arrowIcon }} />
							<Text style={{ ...styles.arrowText }}>PREV</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							let setIndex = currentProfileIndex === profiles.length - 1 ? currentProfileIndex : currentProfileIndex + 1;
							setCurrentProfileIndex(setIndex);
							listReference?.current?.scrollToOffset({
								offset: setIndex * width,
								animated: true,
							});
						}}
						disabled={currentProfileIndex === profiles.length - 1}
						style={{ opacity: currentProfileIndex === profiles.length - 1 ? __Opacity_Factor__ : 1 }}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={{ ...styles.arrowText }}>NEXT</Text>
							<Ionicons name="arrow-forward-circle-outline" size={__Icon_Size__} style={{ ...styles.arrowIcon }} />
						</View>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</View>
	);
}

let getAngle = (flipToggle) => {
	const calculatedDegree = flipToggle.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, 90, 180],
	});
	//return calculatedDegree; // produces error on Android - to do some research
	return "0deg";
};

const Content = ({ item }) => {
	return (
		<>
			<Text
				style={{
					textAlign: "center",
					fontSize: __Standard_Font_Size__ * 2,
					color: __Secondary_Foreground__,
					height: 75,
				}}
				numberOfLines={1}
				adjustsFontSizeToFit
			>
				{item.name}
			</Text>
			<Text style={{ fontSize: __Standard_Font_Size__, fontWeight: "bold", textAlign: "center", textTransform: "uppercase", color: __Primary_Foreground__ }}>{item.role}</Text>
			<View style={{ flexDirection: "row", justifyContent: "center", marginTop: __Inner_Offset__ }}>
				<Text
					style={{
						fontSize: __Standard_Font_Size__,
						lineHeight: __Standard_Line_Height__ * 2,
						fontWeight: "bold",
						alignSelf: "flex-end",
						paddingRight: __Content_Padding__ / 2,
					}}
				>
					$
				</Text>
				<Text
					style={{
						fontSize: __Standard_Font_Size__ * 3,
						color: __Primary_Foreground__,
					}}
				>
					{item.charge}
				</Text>
			</View>
			<Text
				style={{
					fontSize: __Small_Font_Size__,
					lineHeight: __Standard_Line_Height__,
					fontWeight: "bold",
					alignSelf: "center",
				}}
			>
				PER HOUR
			</Text>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	title: {
		fontSize: __Small_Font_Size__,
		textAlign: "left",
		alignContent: "flex-start",
		alignSelf: "flex-start",
	},
	profileImage: {
		width: 256,
		height: 256,
		flexGrow: 0,
	},
	arrowText: {
		fontSize: __Small_Font_Size__,
		fontWeight: "bold",
		textTransform: "uppercase",
		padding: __Content_Padding__,
	},
	arrowIcon: {
		color: __Primary_Foreground__,
		marginLeft: __Content_Padding__,
		marginRight: __Content_Padding__,
	},
});
